import { useState, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

export default function RecipeVideoPlayer({ videoId }: { videoId: string }) {
  const [playing, setPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") setPlaying(false);
  }, []);

  // if no videoId found
  if (!videoId) return null;

  return (
    <View style={styles.container}>
      {!isReady && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      )}

      <YoutubePlayer
        height="190"
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
        onReady={() => setIsReady(true)}
        webViewProps={{ androidLayerType: "hardware" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  loaderContainer: {
    height: 200,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: -1,
  },
});
