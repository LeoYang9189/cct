import React, { createContext, useState, useContext, ReactNode } from 'react';

// 定义模态框类型
type ModalType = 'leadForm' | 'aiChat';

// 定义单个模态框状态
interface ModalState {
  isOpen: boolean;
}

// 定义模态框状态集合
interface ModalStates {
  [key: string]: ModalState;
  leadForm: ModalState;
  aiChat: ModalState;
}

// 定义上下文类型
interface ModalContextType {
  modalState: ModalStates;
  openModal: (modal: ModalType) => void;
  closeModal: (modal: ModalType) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  // 初始化所有模态框状态
  const [modalState, setModalState] = useState<ModalStates>({
    leadForm: { isOpen: false },
    aiChat: { isOpen: false },
  });

  // 打开指定模态框
  const openModal = (modal: ModalType) => {
    setModalState(prevState => ({
      ...prevState,
      [modal]: { isOpen: true },
    }));
  };

  // 关闭指定模态框
  const closeModal = (modal: ModalType) => {
    setModalState(prevState => ({
      ...prevState,
      [modal]: { isOpen: false },
    }));
  };

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
