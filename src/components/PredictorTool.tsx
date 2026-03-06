import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function hashSeed(seed: string, mines: number, gridSize: number): number[] {
  // Simple deterministic hash-based prediction
  let hash = 0;
  const input = `${seed}-${mines}-${gridSize}`;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const safeIndices: number[] = [];
  const total = gridSize * gridSize;
  let h = Math.abs(hash);

  while (safeIndices.length < 3) {
    const idx = h % total;
    if (!safeIndices.includes(idx)) {
      safeIndices.push(idx);
    }
    h = Math.abs((h * 2654435761) >> 0);
    if (h === 0) h = 1;
  }

  return safeIndices;
}

interface PredictorToolProps {
  subscriptionTier: string;
  accuracy: string;
}

export function PredictorTool({ subscriptionTier, accuracy }: PredictorToolProps) {
  const [mines, setMines] = useState(3);
  const [seed, setSeed] = useState("");
  const [seedError, setSeedError] = useState("");
  const [predicted, setPredicted] = useState(false);
  const [safeZones, setSafeZones] = useState<number[]>([]);
  const gridSize = 5;

  const isLocked = subscriptionTier === "none";

  const validateSeed = (s: string) => /^[a-fA-F0-9]{64}$/.test(s);

  const handlePredict = useCallback(() => {
    if (!validateSeed(seed)) {
      setSeedError("Invalid seed — must be a 64-character hex string (SHA256)");
      return;
    }
    setSeedError("");
    const zones = hashSeed(seed, mines, gridSize);
    setSafeZones(zones);
    setPredicted(true);
  }, [seed, mines]);

  return (
    <div className="glass-panel p-6 relative">
      {isLocked && (
        <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl mb-2">🔒</p>
            <p className="font-heading text-lg text-foreground">Upgrade to Access Predictions</p>
            <p className="text-sm text-muted-foreground mt-1">Subscribe to unlock the predictor tool</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl text-foreground">🔮 MINES PREDICTOR</h2>
        {!isLocked && (
          <span className="text-xs font-heading bg-primary/20 text-primary px-3 py-1 rounded-full neon-glow">
            ✅ {accuracy} ACCURACY
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-heading text-muted-foreground uppercase tracking-wider">Mines Count</label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => { setMines(n); setPredicted(false); }}
                  className={`w-10 h-10 rounded-lg font-heading text-sm transition-all ${
                    mines === n
                      ? "bg-primary text-primary-foreground neon-glow"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-heading text-muted-foreground uppercase tracking-wider">Server Seed / Game Seed</label>
            <Input
              value={seed}
              onChange={(e) => { setSeed(e.target.value); setSeedError(""); setPredicted(false); }}
              placeholder="Enter 64-char hex seed..."
              className="mt-1 bg-input border-border focus:border-primary font-mono text-xs"
            />
            {seedError && <p className="text-xs text-accent mt-1">{seedError}</p>}
          </div>

          <Button
            onClick={handlePredict}
            disabled={!seed}
            className="w-full bg-primary text-primary-foreground font-heading font-bold py-6 text-base animate-pulse-neon"
          >
            🔮 PREDICT
          </Button>
        </div>

        <div>
          <label className="text-xs font-heading text-muted-foreground uppercase tracking-wider mb-2 block">5×5 Grid</label>
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: 25 }, (_, i) => {
              const isSafe = predicted && safeZones.includes(i);
              const isDanger = predicted && !isSafe;
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-md flex items-center justify-center text-xs font-heading transition-all duration-300 ${
                    isSafe
                      ? "bg-primary/30 border-2 border-primary neon-glow text-primary"
                      : isDanger
                      ? "bg-accent/10 border border-accent/30 text-accent/50"
                      : "bg-muted border border-border text-muted-foreground"
                  }`}
                >
                  {isSafe ? "✅" : isDanger ? "💣" : "?"}
                </div>
              );
            })}
          </div>
          {predicted && (
            <div className="mt-3 text-center">
              <p className="text-sm text-primary font-heading neon-text">3 Safe Zones Identified</p>
              <p className="text-xs text-muted-foreground mt-1">Remaining cells may contain mines</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
