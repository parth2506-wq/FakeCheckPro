import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border border-[var(--border-color)] rounded-2xl overflow-hidden transition-all duration-300 shadow-sm">
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isOpen ? 'bg-[var(--surface-elevated)] text-[var(--accent)] font-semibold shadow-sm border-b border-[var(--border-color)]' : 'bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--text-primary)] font-medium'
          }`}
      >
        <span className="pr-4">{question}</span>
        <div className={`p-1 rounded-full shrink-0 transition-colors ${isOpen ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'bg-[var(--text-primary)]/10 text-[var(--text-secondary)]'}`}>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="p-5 bg-[var(--surface)] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)] text-sm sm:text-base">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: t("faq.q1"),
      a: t("faq.a1")
    },
    {
      q: t("faq.q2"),
      a: t("faq.a2")
    },
    {
      q: t("faq.q3"),
      a: t("faq.a3")
    },
    {
      q: t("faq.q4"),
      a: t("faq.a4")
    },
    {
      q: t("faq.q5"),
      a: t("faq.a5")
    },
    {
      q: t("faq.q6"),
      a: t("faq.a6")
    },
    {
      q: t("faq.q7"),
      a: t("faq.a7")
    },
    {
      q: t("faq.q8"),
      a: t("faq.a8")
    },
    {
      q: t("faq.q9"),
      a: t("faq.a9")
    },
    {
      q: t("faq.q10"),
      a: t("faq.a10")
    }
  ];

  return (
    <DashboardLayout title={t("faq.title")}>
      <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-10">

        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-[var(--accent-soft)] rounded-2xl flex items-center justify-center mb-2 shadow-inner border border-[var(--accent)]/20">
            <HelpCircle size={32} className="text-[var(--accent)]" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{t("faq.gotQuestions")}</h1>
          <p className="text-[var(--text-secondary)] max-w-2xl px-4">
            {t("faq.desc")}
          </p>
        </div>

        {/* FAQ List */}
        <GlassCard className="p-4 sm:p-8 flex flex-col gap-4 bg-[var(--surface-elevated)] border-[var(--border-color)] animate-in fade-in slide-in-from-bottom-8 duration-700">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </GlassCard>

      </div>
    </DashboardLayout>
  );
};

export default FAQ;
