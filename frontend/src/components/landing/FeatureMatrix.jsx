import React from 'react';
import { motion } from 'framer-motion';
import { Image, Link, FileText, FileUp, Mic, QrCode } from 'lucide-react';

const FeatureMatrix = () => {
  const methods = [
    { id: 'image', icon: Image, title: 'Scan Image', desc: 'Extract text from screenshots and newspaper clippings.' },
    { id: 'url', icon: Link, title: 'Paste URL', desc: 'Analyze content directly from a news website URL.' },
    { id: 'manual', icon: FileText, title: 'Enter Manually', desc: 'Paste raw text directly for instant evaluation.' },
    { id: 'pdf', icon: FileUp, title: 'Upload PDF', desc: 'Extract and analyze text from PDF documents.' },
    { id: 'voice', icon: Mic, title: 'Voice Input', desc: 'Transcribe and analyze spoken claims instantly.' },
    { id: 'qr', icon: QrCode, title: 'Scan QR', desc: 'Quickly access and analyze articles via QR code.' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="features" className="w-full py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">Six Ways to Analyze</h2>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
          Choose the input method that best fits your workflow. 
          Our extraction pipeline seamlessly processes multiple formats.
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {methods.map((m) => {
          const Icon = m.icon;
          return (
            <motion.div key={m.id} variants={itemVariants} className="group glass-card p-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl transition-all cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="text-[var(--accent)]" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">{m.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{m.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default FeatureMatrix;
