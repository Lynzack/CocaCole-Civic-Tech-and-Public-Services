import { useState } from "react";
import {
Search,
Phone,
Bot,
ChevronDown,
} from "lucide-react";

import "./Support.css";
import faqData from "./FAQData";
import AIChat from "./AIChat";
import translations from "./translations";

export default function Support({
    language
}) {
const [selectedCategory, setSelectedCategory] =
    useState("General Safety");

const t = translations[language] || translations.ENG;
const [openQuestion, setOpenQuestion] = useState(null);
const [searchTerm, setSearchTerm] = useState("");

const [showAIChat, setShowAIChat] =
  useState(false);

const categories = [
    {
        id: "General Safety",
        label: t.support.categories.generalSafety
    },
    {
        id: "Rape & Sexual Assault",
        label: t.support.categories.rapeSexualAssault
    },
    {
        id: "Sexual Harassment",
        label: t.support.categories.sexualHarassment
    },
    {
        id: "Murder & Serious Violence",
        label: t.support.categories.murderViolence
    },
    {
        id: "Robbery",
        label: t.support.categories.robbery
    },
    {
        id: "Physical Assault",
        label: t.support.categories.physicalAssault
    }
];

const currentFaqs =
  faqData[language]?.[selectedCategory] || [];

const filteredFaqs =
  searchTerm.trim() === ""
    ? currentFaqs
    : Object.values(faqData[language] || {})
        .flat()
        .filter((faq) =>
          faq.question
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
        );

if (showAIChat) {
  return (
    <AIChat
      language={language}
      onBack={() => setShowAIChat(false)}
    />
  );
}

return (
    <div className="support-page">

    <div className="support-header">
        <h1>{t.support.title}</h1>
        <p>{t.support.subtitle}</p>
    </div>


    <div className="support-search">

        <Search size={18} />

        <input
            type="text"
            placeholder={t.support.searchPlaceholder}
            value={searchTerm}
            onChange={(event) =>
                setSearchTerm(event.target.value)
        }
        />

    </div>


    <div className="emergency-card">

        <div className="emergency-icon">
        <Phone size={20} />
        </div>

        <div className="emergency-text">

        <strong>{t.support.emergencyTitle}</strong>
        <p>{t.support.emergencyText}</p>

        </div>

        <a
        href="tel:999"
        className="emergency-button"
        >
        {t.support.call999}
        </a>

    </div>


    <section className="faq-section">

        <h2>
        {t.support.faqTitle}
        </h2>

        <p className="faq-subtitle">
        {t.support.faqSubtitle}
        </p>


        <div className="faq-categories">

        {categories.map((category) => (

            <button
            key={category.id}
            type="button"
            className={`faq-category ${
                selectedCategory === category.id
                ? "active"
                : ""
            }`}
            onClick={() =>{
                setSelectedCategory(category.id);
                setOpenQuestion(null);
            }}
            >
            {category.label}
            </button>

        ))}

        </div>


        <div className="faq-list">

        {filteredFaqs.map((faq, index) => {

            const isOpen = openQuestion === index;

            return (
            <div
                className="faq-item"
                key={index}
            >

                <button
                type="button"
                className="faq-question"
                onClick={() =>
                    setOpenQuestion(
                    isOpen ? null : index
                    )
                }
                >

                <span>
                    {faq.question}
                </span>

                <ChevronDown
                    size={18}
                    className={
                    isOpen
                        ? "faq-chevron open"
                        : "faq-chevron"
                    }
                />

                </button>

                {isOpen && (
                <div className="faq-answer">

                    {faq.intro && (
                    <p className="faq-intro">
                        {faq.intro}
                    </p>
                    )}

                    <ol>
                    {faq.answer.map(
                        (item, answerIndex) => (
                        <li key={answerIndex}>
                            {item}
                        </li>
                        )
                    )}
                    </ol>

                    {faq.note && (
                    <p className="faq-note">
                        {faq.note}
                    </p>
                    )}

                </div>
                )}

            </div>
            );
        })}

        </div>

    </section>


    <button
        type="button"
        className="ai-assistant-button"
        onClick={() => setShowAIChat(true)}
        >
        <Bot size={24} />
    </button>

    </div>
);
}