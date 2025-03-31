'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface NetworkConfigurationState {
    networkConfiguration: string;
    setNetworkConfiguration: (networkConfiguration: string) => void;
}

export const NetworkConfigurationContext = createContext<NetworkConfigurationState>({} as NetworkConfigurationState);

export function useNetworkConfiguration(): NetworkConfigurationState {
    return useContext(NetworkConfigurationContext);
}

interface NetworkConfigurationProviderProps {
    children: ReactNode;
}

export const NetworkConfigurationProvider = ({ children }: NetworkConfigurationProviderProps) => {
    const [networkConfiguration, setNetworkConfiguration] = useState("mainnet-beta");

    useEffect(() => {
        const savedNetwork = localStorage.getItem("network");
        if (savedNetwork) {
            setNetworkConfiguration(savedNetwork);
        }
    }, []);

    const handleSetNetworkConfiguration = (newNetwork: string) => {
        setNetworkConfiguration(newNetwork);
        localStorage.setItem("network", newNetwork);
    };

    return (
        <NetworkConfigurationContext.Provider 
            value={{ 
                networkConfiguration, 
                setNetworkConfiguration: handleSetNetworkConfiguration 
            }}
        >
            {children}
        </NetworkConfigurationContext.Provider>
    );
};