import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc, increment, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';

const symbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '7️⃣', '💰', '🔔'];

const SlotMachine = () => {
  const { currentUser } = useAuth();
  const [credits, setCredits] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(['🍒', '🍊', '🍇']);
  const [betAmount, setBetAmount] = useState(10);

  useEffect(() => {
    const fetchCredits = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setCredits(userDoc.data().credits);
        }
      }
    };
    fetchCredits();
  }, [currentUser]);

  const spin = async () => {
    if (spinning || credits < betAmount) return;
    
    setSpinning(true);
    
    // Deduct bet amount
    await updateDoc(doc(db, 'users', currentUser.uid), {
      credits: increment(-betAmount)
    });
    setCredits(prev => prev - betAmount);
    
    // Simulate spinning animation
    const spinDuration = 2000; // 2 seconds
    const startTime = Date.now();
    
    const spinInterval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
    }, 100);
    
    setTimeout(async () => {
      clearInterval(spinInterval);
      
      // Determine final reels
      const finalReels = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ];
      
      setReels(finalReels);
      setSpinning(false);
      
      // Check for win
      const winMultiplier = calculateWin(finalReels);
      
      if (winMultiplier > 0) {
        const winAmount = betAmount * winMultiplier;
        await updateDoc(doc(db, 'users', currentUser.uid), {
          credits: increment(winAmount),
          history: arrayUnion({
            type: 'win',
            amount: winAmount,
            reels: finalReels,
            timestamp: serverTimestamp()
          })
        });
        setCredits(prev => prev + winAmount);
        toast.success(`Você ganhou ${winAmount} créditos!`);
      } else {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          history: arrayUnion({
            type: 'loss',
            amount: betAmount,
            reels: finalReels,
            timestamp: serverTimestamp()
          })
        });
        toast.error('Tente novamente!');
      }
    }, spinDuration);
  };
  
  const calculateWin = (reels) => {
    // All three symbols match
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      if (reels[0] === '7️⃣') return 10;
      if (reels[0] === '💰') return 8;
      return 5;
    }
    
    // Two symbols match
    if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
      return 2;
    }
    
    return 0;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div className="text-white text-xl font-bold">
            <FontAwesomeIcon icon={faCoins} className="mr-2" />
            Créditos: {credits}
          </div>
          <div className="text-white">
            Aposta: 
            <select 
              value={betAmount} 
              onChange={(e) => setBetAmount(parseInt(e.target.value))}
              className="ml-2 bg-gray-700 text-white rounded px-2 py-1"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <div className="flex justify-center space-x-4 text-6xl py-4">
            {reels.map((reel, index) => (
              <div key={index} className="bg-gray-800 rounded px-4 py-2">
                {reel}
              </div>
            ))}
          </div>
        </div>
        
        <button
          onClick={spin}
          disabled={spinning || credits < betAmount}
          className={`w-full py-3 rounded-lg font-bold text-lg ${spinning ? 'bg-yellow-500' : credits < betAmount ? 'bg-red-600' : 'bg-green-600'} text-white transition-colors`}
        >
          {spinning ? 'Girando...' : 'GIRAR'}
        </button>
      </div>
    </div>
  );
};

export default SlotMachine;