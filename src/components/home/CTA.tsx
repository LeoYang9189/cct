import { motion } from 'framer-motion';
import { useModal } from '../../contexts/ModalContext';

const CTA = () => {
  const { openModal } = useModal();

  return (
    <section className="section-padding bg-gradient-to-r from-primary to-secondary wave-bg">
      <div className="container-custom relative z-10">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-wave-pattern"></div>

          <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="md:w-2/3 mb-8 md:mb-0">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
              >
                准备好体验智能物流助手了吗？
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-gray-600"
              >
                立即开始体验WallTech旗下Wo AI！智能物流服务，让您的国际物流业务更高效、更准确、更智能。
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <button
                type="button"
                className="btn-primary"
                aria-label="免费试用产品"
                onClick={() => openModal('leadForm')}
              >
                免费试用
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;