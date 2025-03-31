'use client';

import { useEffect, useState } from 'react'
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import useNotificationStore from '../stores/useNotificationStore'
import { useConnection } from '@solana/wallet-adapter-react';
import { getExplorerUrl } from '../utils/explorer'
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';

interface NotificationProps {
  type: 'success' | 'error' | 'info';
  message: string;
  description?: string;
  txid?: string;
  onHide: () => void;
}

interface NotificationState {
  notifications: Array<{
    type: 'success' | 'error' | 'info';
    message: string;
    description?: string;
    txid?: string;
  }>;
}

const NotificationList = () => {
  const { notifications, set: setNotificationStore } = useNotificationStore(
    (state: NotificationState) => state
  )

  const reversedNotifications = [...notifications].reverse()

  return (
    <div
      className={`z-20 fixed inset-20 flex items-end px-4 py-6 pointer-events-none sm:p-6`}
    >
      <div className={`flex flex-col w-full`}>
        {reversedNotifications.map((n, idx) => (
          <Notification
            key={`${n.message}${idx}`}
            type={n.type}
            message={n.message}
            description={n.description}
            txid={n.txid}
            onHide={() => {
              setNotificationStore((state: NotificationState) => {
                const reversedIndex = reversedNotifications.length - 1 - idx;
                state.notifications = [
                  ...notifications.slice(0, reversedIndex),
                  ...notifications.slice(reversedIndex + 1),
                ];
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}

const Notification = ({ type, message, description, txid, onHide }: NotificationProps) => {
  const { connection } = useConnection();
  const { networkConfiguration } = useNetworkConfiguration();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onHide, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onHide]);

  if (!show) return null;

  const iconMap = {
    success: <CheckCircleIcon className="h-6 w-6 text-green-400" />,
    error: <XCircleIcon className="h-6 w-6 text-red-400" />,
    info: <InformationCircleIcon className="h-6 w-6 text-blue-400" />,
  };

  return (
    <div className="bg-base-200 rounded-lg shadow-lg p-4 mb-4 flex items-start">
      <div className="flex-shrink-0">{iconMap[type]}</div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium">{message}</p>
        {description && <p className="text-sm text-base-content/70">{description}</p>}
        {txid && (
          <a
            href={getExplorerUrl(networkConfiguration, txid, 'tx')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-primary-focus"
          >
            View on Explorer
          </a>
        )}
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button
          onClick={() => {
            setShow(false);
            setTimeout(onHide, 300);
          }}
          className="btn btn-ghost btn-sm"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default NotificationList;
