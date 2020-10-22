import React from 'react';
import Lottie from 'react-lottie';
import preloader from '../lotties/preloader.json';

export default function App() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: preloader,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      };
    
    return (
      <div>
        <Lottie 
          options={defaultOptions}
          height={400}
          width={400}
        />
      </div>
    );
  }
  
  