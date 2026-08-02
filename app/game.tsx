import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { router } from 'expo-router';

import { spacing } from '../src/theme/tokens';
import { useGameStore } from '../src/store/gameStore';
import { PaperBackground } from '../src/components/PaperBackground';
import { GameProgress } from '../src/components/GameProgress';
import { PlayerCard } from '../src/components/PlayerCard';
import { BottomScoreSheet } from '../src/components/BottomScoreSheet';
import { HistoryDrawer } from '../src/components/HistoryDrawer';
import { FloatingUndo } from '../src/components/FloatingUndo';
import { WinnerModal } from '../src/components/WinnerModal';
import type { ScoreIncrement } from '../src/types/domino';

export default function GameScreen() {
  const activeGame = useGameStore((s) => s.activeGame);
  const addScore = useGameStore((s) => s.addScore);
  const undoLast = useGameStore((s) => s.undoLast);
  const rematch = useGameStore((s) => s.rematch);
  const endActiveGame = useGameStore((s) => s.endActiveGame);

  const [scoreSheetPlayerId, setScoreSheetPlayerId] = useState<string | null>(null);
  const [historyPlayerId, setHistoryPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeGame) router.replace('/');
  }, [activeGame]);

  if (!activeGame) return null;

  const leaderScore = Math.max(0, ...activeGame.players.map((p) => p.score));
  const historyPlayer = activeGame.players.find((p) => p.id === historyPlayerId) ?? null;
  const winner = activeGame.players.find((p) => p.id === activeGame.winnerId) ?? null;
  const hasScored = activeGame.players.some((p) => p.history.length > 0);

  const handleSelectAmount = (amount: ScoreIncrement) => {
    if (scoreSheetPlayerId) addScore(scoreSheetPlayerId, amount);
  };

  return (
    <PaperBackground>
      <GameProgress current={leaderScore} target={activeGame.winningScore} />

      <FlatList
        data={activeGame.players}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ gap: spacing.md, padding: spacing.md, paddingBottom: 96 }}
        renderItem={({ item }) => (
          <PlayerCard
            player={item}
            isWinner={item.id === activeGame.winnerId}
            onScorePress={() => setScoreSheetPlayerId(item.id)}
            onHistoryPress={() => setHistoryPlayerId(item.id)}
          />
        )}
      />

      <FloatingUndo visible={hasScored && !activeGame.winnerId} onUndo={undoLast} />

      <BottomScoreSheet
        visible={!!scoreSheetPlayerId}
        onClose={() => setScoreSheetPlayerId(null)}
        onSelect={handleSelectAmount}
      />

      <HistoryDrawer player={historyPlayer} visible={!!historyPlayerId} onClose={() => setHistoryPlayerId(null)} />

      <WinnerModal
        visible={!!activeGame.winnerId}
        winner={winner}
        onRematch={() => {
          rematch();
        }}
        onNewGame={() => {
          endActiveGame();
          router.replace('/');
        }}
        onStatistics={() => {
          router.push('/statistics');
        }}
      />
    </PaperBackground>
  );
}
