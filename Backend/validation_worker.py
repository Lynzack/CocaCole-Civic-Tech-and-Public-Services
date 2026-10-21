import logging
import time

from datetime import datetime, timedelta, timezone
from uuid import uuid4

from database import supabase
from services.validation_service import validate_incident


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)

logger = logging.getLogger("validation_worker")

MAX_ATTEMPTS = 3


def job_outcome(result, attempts):
    status = result["status"]
    body = result.get("body") or {}

    now = datetime.now(timezone.utc)

    update = {
        "updated_at": now.isoformat(),
        "locked_until": None,
        "lock_token": None,
        "outcome": None
    }

    if (
        status in (200, 201)
        and body.get("success") is True
    ):
        published = (
            body.get("published") is True
            or bool(body.get("incident"))
        )

        update.update({
            "status": "completed",
            "outcome": (
                "published"
                if published
                else "not_published"
            ),
            "last_error": None
        })

    else:
        retry = (
            (status == 429 or status >= 500)
            and attempts < MAX_ATTEMPTS
        )

        retry_delay = 60 * 2 ** (attempts - 1)

        update.update({
            "status": (
                "queued" if retry else "failed"
            ),
            "last_error": str(
                body.get("message")
                or f"Review returned HTTP {status}"
            )[:1000],
            "available_at": (
                now + timedelta(seconds=retry_delay)
            ).isoformat()
        })

    return update


def process_job(job):
    incident_id = job["incident_id"]
    token = job["lock_token"]

    logger.info(
        "Automatic review started: %s (attempt %s)",
        incident_id,
        job["attempts"]
    )

    try:
        result = validate_incident(incident_id)

        update = job_outcome(
            result,
            job["attempts"]
        )

    except Exception:
        logger.exception(
            "Unexpected review failure: %s",
            incident_id
        )

        update = job_outcome(
            {
                "status": 503,
                "body": {
                    "message": (
                        "Unexpected worker error; "
                        "check worker logs"
                    )
                }
            },
            job["attempts"]
        )

    response = (
        supabase
        .table("incident_validation_jobs")
        .update(update)
        .eq("incident_id", incident_id)
        .eq("status", "processing")
        .eq("lock_token", token)
        .execute()
    )

    if not response.data:
        logger.warning(
            "Job ownership changed; "
            "no queue update saved: %s",
            incident_id
        )

    else:
        logger.info(
            "Automatic review %s: %s (%s)",
            update["status"],
            incident_id,
            update.get("outcome")
        )


def main():
    logger.info(
        "Automatic validation worker is running. "
        "Press Ctrl+C to stop."
    )

    while True:
        try:
            response = (
                supabase
                .rpc(
                    "claim_incident_validation_job",
                    {
                        "p_lock_token": str(uuid4())
                    }
                )
                .execute()
            )

            jobs = response.data or []

            if jobs:
                process_job(jobs[0])
            else:
                time.sleep(5)

        except KeyboardInterrupt:
            logger.info(
                "Worker stopped. An interrupted job "
                "can be reclaimed after its lease expires."
            )
            break

        except Exception:
            logger.exception(
                "Queue operation failed; "
                "retrying in 15 seconds"
            )

            time.sleep(15)


if __name__ == "__main__":
    main()