'use client';

import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, EVENTS } from 'react-joyride';
import { useTranslations } from 'next-intl';

interface AccountsTutorialProps {
  run: boolean;
  onRunChange: (run: boolean) => void;
  onOpenModal?: () => void;
}

// Função utilitária para resetar o tutorial (útil para testes)
export const resetTutorial = () => {
  localStorage.removeItem('hasSeenAccountsTutorial');
};

export const AccountsTutorial: React.FC<AccountsTutorialProps> = ({
  run,
  onRunChange,
  onOpenModal,
}) => {
  const t = useTranslations('Tutorial');
  const [hasSeenTutorial, setHasSeenTutorial] = useState<boolean | null>(null);
  const [tutorialInitialized, setTutorialInitialized] = useState(false);

  // Verificar se o tutorial já foi visto e executar apenas na primeira visita
  useEffect(() => {
    if (tutorialInitialized) return;

    const seen = localStorage.getItem('hasSeenAccountsTutorial');
    const hasSeen = seen === 'true';
    setHasSeenTutorial(hasSeen);
    setTutorialInitialized(true);

    // Só executa o tutorial se não foi visto ainda
    if (!hasSeen && !run) {
      // Pequeno delay para garantir que a página carregou completamente
      const timer = setTimeout(() => {
        onRunChange(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [run, onRunChange, tutorialInitialized]);

  const steps = [
    {
      target: '[data-tour-id="page-title"]',
      content: t('step1.content'),
      placement: 'bottom' as const,
      disableBeacon: true,
    },
    {
      target: '[data-tour-id="summary-cards"]',
      content: t('step2.content'),
      placement: 'bottom' as const,
    },
    {
      target: '[data-tour-id="monthly-table"]',
      content: t('step3.content'),
      placement: 'top' as const,
    },
    {
      target: '[data-tour-id="add-account-button"]',
      content: t('step4.content'),
      placement: 'left' as const,
    },
    // Passos do modal (quando estiver aberto)
    {
      target: '[data-tour-id="modal-title"]',
      content: t('step5.content'),
      placement: 'bottom' as const,
    },
    {
      target: '[data-tour-id="toggle-parcelas"]',
      content: t('step6.content'),
      placement: 'right' as const,
    },
    {
      target: '[data-tour-id="toggle-preview"]',
      content: t('step7.content'),
      placement: 'right' as const,
    },
    {
      target: '[data-tour-id="field-tipo"]',
      content: t('step8.content'),
      placement: 'bottom' as const,
    },
    {
      target: '[data-tour-id="field-nome"]',
      content: t('step9.content'),
      placement: 'bottom' as const,
    },
    {
      target: '[data-tour-id="field-valor-total"]',
      content: t('step10.content'),
      placement: 'bottom' as const,
    },
    {
      target: '[data-tour-id="field-parcelas"]',
      content: t('step11.content'),
      placement: 'bottom' as const,
    },
    {
      target: '[data-tour-id="field-data-inicio"]',
      content: t('step12.content'),
      placement: 'bottom' as const,
    },
    {
      target: '[data-tour-id="field-referencia"]',
      content: t('step13.content'),
      placement: 'bottom' as const,
    },
    {
      target: '[data-tour-id="field-vencimento"]',
      content: t('step14.content'),
      placement: 'bottom' as const,
    },
    {
      target: '[data-tour-id="modal-actions"]',
      content: t('step15.content'),
      placement: 'top' as const,
    },
    {
      target: 'body',
      content: t('step16.content'),
      placement: 'center' as const,
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, action, index } = data;

    // Abrir modal automaticamente quando chegar no passo 4 (botão adicionar conta)
    if (action === 'next' && index === 3 && onOpenModal) {
      setTimeout(() => {
        onOpenModal();
      }, 500);
    }

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      // Marcar tutorial como visto
      localStorage.setItem('hasSeenAccountsTutorial', 'true');
      setHasSeenTutorial(true);
      onRunChange(false);
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // Pequeno delay para transições suaves
      setTimeout(() => {}, 100);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      stepIndex={undefined}
      debug={false}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#3B82F6',
          textColor: '#374151',
          backgroundColor: '#FFFFFF',
          overlayColor: 'rgba(0, 0, 0, 0.4)',
          spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
          beaconSize: 36,
          width: 320,
        },
        tooltip: {
          borderRadius: 12,
          padding: 24,
          fontSize: 14,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          maxWidth: '420px',
          minWidth: '350px',
          width: 'auto',
        },
        tooltipContainer: {
          textAlign: 'left' as const,
        },
        tooltipFooter: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginTop: 16,
          flexWrap: 'nowrap',
          gap: 8,
          width: '100%',
        },
        tooltipTitle: {
          fontSize: 16,
          fontWeight: 600,
          color: '#111827', // gray-900
          marginBottom: 8,
        },
        tooltipContent: {
          fontSize: 14,
          lineHeight: 1.5,
          color: '#6B7280', // gray-500
        },
        buttonNext: {
          backgroundColor: '#3B82F6',
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: 14,
          fontWeight: 500,
          border: 'none',
          color: '#FFFFFF',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '100px',
          height: '44px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        },
        buttonBack: {
          backgroundColor: '#F3F4F6',
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: 14,
          fontWeight: 500,
          border: 'none',
          color: '#374151',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '100px',
          height: '44px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        },
        buttonSkip: {
          backgroundColor: 'transparent',
          borderRadius: 8,
          padding: '12px 16px',
          fontSize: 14,
          fontWeight: 500,
          border: 'none',
          color: '#6B7280',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '80px',
          height: '44px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        },
        buttonClose: {
          backgroundColor: 'transparent',
          borderRadius: 8,
          padding: '12px 16px',
          fontSize: 14,
          fontWeight: 500,
          border: 'none',
          color: '#6B7280',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '80px',
          height: '44px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        },
        spotlight: {
          borderRadius: 8,
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
      }}
      locale={{
        back: t('back'),
        close: t('close'),
        last: t('finish'),
        next: t('next'),
        skip: t('skip'),
      }}
      spotlightPadding={10}
      disableOverlayClose
      hideCloseButton={false}
      disableScrolling={false}
      scrollOffset={100}
      scrollDuration={300}
      disableCloseOnEsc={false}
      hideBackButton={false}
    />
  );
};
