import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { avatarSvgData, AVATAR_KEYS, AVATAR_NAMES, AvatarKey } from '../src/data/avatarSvgData';

interface PlayerAvatarProps {
  playerIndex: number;
  size?: number;
  style?: ViewStyle;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  playerIndex,
  size = 64,
  style,
}) => {
  const avatarKey = AVATAR_KEYS[playerIndex % AVATAR_KEYS.length] as AvatarKey;
  const svgData = avatarSvgData[avatarKey];

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <SvgXml
        xml={svgData}
        width={size}
        height={size}
      />
    </View>
  );
};

// Helper to get avatar name for a player
export const getPlayerAvatarName = (playerIndex: number): string => {
  const avatarKey = AVATAR_KEYS[playerIndex % AVATAR_KEYS.length];
  return AVATAR_NAMES[avatarKey];
};

// Re-export for convenience
export { AVATAR_KEYS, AVATAR_NAMES };
export type { AvatarKey };

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default PlayerAvatar;
