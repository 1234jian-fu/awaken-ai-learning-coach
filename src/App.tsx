import React from 'react';
import IPhoneFrame from './components/IPhoneFrame';
import BlueprintPage from './components/BlueprintPage';

export default function App() {
  return (
    <IPhoneFrame>
      {/* 
        Single High-Fidelity iPhone App Viewport
        Includes Blueprint view, speech assistant, and neural diagnostic summaries
        switchable instantly from the iOS-styled master tab navigation bar.
      */}
      <BlueprintPage />
    </IPhoneFrame>
  );
}
