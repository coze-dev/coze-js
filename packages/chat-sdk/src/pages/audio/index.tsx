import { Button, View } from "@tarojs/components";
import styles from "./index.module.less";
import { useEffect, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { getBoundingRect, isWeb, logger, nanoid } from "@/libs/utils";
import { AudioInput, Spacing } from "@/libs/ui-kit";
import { getRecorderManager } from "@/libs/utils/recorder-manager";
import {
  BaseRecorderManager,
  RecorderEvent,
} from "@/libs/utils/recorder-manager/type";
import { AudioWave } from "@/libs/ui-kit";
import { AudioPlay } from "@/libs/ui-kit/atomic/audio-play";

const audioData = {
  "1716890360322": 0.4,
  "1716890360453": 0.6,
  "1716890360584": 0.5,
  "1716890360702": 0.9,
  "1716890360833": 0.6,
  "1716890360962": 0.9,
  "1716890361089": 0.18,
  "1716890361214": 0.4,
  "1716890361338": 0.18,
  "1716890361474": 0.09,
  "1716890361599": 0.11,
  "1716890361736": 0.06,
  "1716890361849": 0.1,
  "1716890361984": 0.02,
  "1716890362110": 0.07,
  "1716890362239": 0.07,
  "1716890362360": 0.09,
  "1716890362494": 0.1,
  "1716890362621": 0.01,
  "1716890362751": 0.11,
  "1716890362870": 0.03,
  "1716890363000": 0.01,
  "1716890363132": 0.01,
  "1716890363262": 0.05,
  "1716890363393": 0.01,
  "1716890363510": 0.03,
  "1716890363642": 0.05,
  "1716890363773": 0.03,
  "1716890363898": 0.09,
  "1716890364045": 0.04,
  "1716890364159": 0.08,
  "1716890364296": 0.04,
  "1716890364420": 0.02,
  "1716890364551": 0.04,
  "1716890364670": 0.03,
  "1716890364799": 0.01,
  "1716890364931": 0.05,
  "1716890365060": 0.01,
  "1716890365181": 0.08,
  "1716890365310": 0.26,
  "1716890365442": 0.26,
  "1716890365572": 0.07,
  "1716890365703": 0.09,
  "1716890365821": 0.24,
  "1716890365953": 0.08,
  "1716890366083": 0.04,
  "1716890366208": 0.03,
  "1716890366332": 0.12,
  "1716890366458": 0.04,
  "1716890366594": 0.07,
  "1716890366719": 0.02,
  "1716890366856": 0.07,
  "1716890366969": 0.04,
  "1716890367105": 0.02,
  "1716890367230": 0.05,
  "1716890367360": 0.05,
  "1716890367479": 0.01,
  "1716890367615": 0.03,
  "1716890367741": 0.01,
  "1716890367871": 0.51,
  "1716890367990": 0.01,
  "1716890368120": 0.41,
  "1716890368252": 0.01,
  "1716890368381": 0.09,
  "1716890368513": 0.09,
  "1716890368631": 0.05,
  "1716890368763": 0.05,
  "1716890368905": 0.03,
  "1716890369018": 0.09,
  "1716890369165": 0.02,
  "1716890369273": 0.03,
  "1716890369415": 0.04,
  "1716890369540": 0.03,
  "1716890369669": 0.9,
  "1716890369790": 0.07,
  "1716890369919": 0.03,
  "1716890370051": 0.03,
  "1716890370180": 0.7,
  "1716890370301": 0.6,
  "1716890370430": 0.6,
  "1716890370562": 0.4,
  "1716890370691": 0.8,
  "1716980364045": 0.04,
  "1716980364159": 0.08,
  "1716980364296": 0.04,
  "17161890364420": 0.02,
  "17168290364551": 0.04,
  "17168902364670": 0.03,
  "17168920364799": 0.01,
  "17168903624931": 0.05,
  "17168903265060": 0.01,
  "17168903652181": 0.08,
  "1716890370697": 0,
};

export default function Index() {
  const ref1 = useRef<Taro.RecorderManager>();
  const ref2 = useRef<MediaRecorder>();
  const ref11 = useRef<BaseRecorderManager>();
  const ref12 = useRef<BaseRecorderManager>();
  const [volume, setVolume] = useState(0);
  logger.seDebug();
  useEffect(() => {
    const timestamps = Object.keys(audioData);
    let index = 0;
    function animate() {
      if (index < timestamps.length) {
        const volume = audioData[timestamps[index]] * 5;
        console.log("[volume]", volume, timestamps[index], index);
        index++;
        //setVolume(volume);
        //setTimeout(animate, 100);
      }
    }
    animate();
  }, []);
  const [isPlaying, setIsPlaying] = useState(false);

  setTimeout(() => {
    setIsPlaying(true);
  }, 3000);
  //<AudioWave type="primary" size="medium" volumeNumber={0} />
  return (
    <View className={styles.container}>
      <AudioPlay isPlaying={isPlaying} />

      <Spacing horizontalCenter style={{ height: "30px" }}>
        <AudioWave type="primary" size="medium" volumeNumber={volume} />
      </Spacing>
      <View
        onClick={() => {
          const recordManager = Taro.getRecorderManager();
          ref1.current = recordManager;
          console.log("recordManager.offStart", recordManager.offStart);
          recordManager.onError((error) => {
            console.log("recordManager error", error);
          });
          recordManager.onStart((res) => {
            console.log("recordManager onStart", res);
          });
          recordManager.onStop((res) => {
            console.log("recordManager onStop", res);
            setTimeout(() => {
              console.log("recordManager onStop 2000", res);
              const innerAudioContext = Taro.createInnerAudioContext();
              //innerAudioContext.autoplay = true;
              innerAudioContext.src = res.tempFilePath;
              innerAudioContext.obeyMuteSwitch = false;
              innerAudioContext.onPlay(() => {
                console.log("innerAudioContext onPlay");
              });
              innerAudioContext.onError((res) => {
                console.log(res.errMsg);
                console.log(res.errCode);
              });
              innerAudioContext.onEnded(() => {
                console.log("innerAudioContext onEnded");
              });
              innerAudioContext.play();
            }, 3000);
          });
          recordManager.onPause((res) => {
            console.log("recordManager onPause", res);
          });
          recordManager.onInterruptionBegin?.((res) => {
            console.log("recordManager onInterruptionBegin", res);
          });
          recordManager.onInterruptionEnd?.((res) => {
            console.log("recordManager onInterruptionEnd", res);
          });
          recordManager.onFrameRecorded((res) => {
            console.log("recordManager onFrameRecorded", res);
          });
          recordManager.onResume((res) => {
            console.log("recordManager onResume", res);
          });

          recordManager.start({
            duration: 50000,
            //sampleRate: 44100,
            numberOfChannels: 2,
            //encodeBitRate: 192000,
            format: "aac",
          });
        }}
      >
        Audio
      </View>
      <View
        onClick={() => {
          ref1.current?.stop();
        }}
        style={{
          marginTop: 100,
        }}
      >
        Stop
      </View>

      <View
        onClick={async () => {
          const res = await Taro.request({
            url: "https://api.coze.cn/v1/audio/speech",
            method: "POST",
            responseType: "arraybuffer",
            header: {
              Authorization:
                "Bearer pat_cysE2CIIp4elK3QWrqmISirO4toqKnrfACO3j9YQt5BQU9P4q9nbgKQcgsLXndWp",
            },
            data: {
              input: "再换一个",
              voice_id: "7426720361733046281",
              response_format: "wav",
              sampling_rate: 8000,
            },
          });
          let tempFile = Taro.env.USER_DATA_PATH + `/tempFile${nanoid()}.wav`;
          console.log("res:", res);
          if (Taro.getEnv() === "WEB") {
            const blobData = new Blob([res.data], {
              type: "audio/wav",
            });
            tempFile = URL.createObjectURL(blobData);
          } else {
            Taro.getFileSystemManager().writeFileSync(
              tempFile,
              res.data,
              "binary"
            );
          }
          const innerAudioContext = Taro.createInnerAudioContext();
          //innerAudioContext.autoplay = true;
          innerAudioContext.src = tempFile;
          innerAudioContext.onPlay(() => {
            console.log("innerAudioContext onPlay");
          });
          innerAudioContext.onError((res) => {
            console.log(res.errMsg);
            console.log(res.errCode);
          });
          innerAudioContext.onEnded(() => {
            console.log("innerAudioContext onEnded");
          });
          innerAudioContext.play();
          console.log("rest:", tempFile);
        }}
        style={{
          marginTop: 100,
        }}
      >
        download And Play
      </View>

      <View
        onClick={async () => {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              sampleRate: 8000, // 采样率

              channelCount: 1, // 通道数
            },
          });
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: "audio/webm", // 编码格式
          });
          ref2.current = mediaRecorder;
          const chunks = [];
          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunks.push(e.data);
            }
          };
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/webm" });
            // 可以在这里对录制好的音频Blob进行后续处理，比如保存、上传等
            console.log("录音完成，生成音频Blob", blob);
            const tempFile = URL.createObjectURL(blob);
            const innerAudioContext = Taro.createInnerAudioContext();
            //innerAudioContext.autoplay = true;
            innerAudioContext.src = tempFile;
            innerAudioContext.onPlay(() => {
              console.log("innerAudioContext onPlay");
            });
            innerAudioContext.onError((res) => {
              console.log(res.errMsg);
              console.log(res.errCode);
            });
            innerAudioContext.onEnded(() => {
              console.log("innerAudioContext onEnded");
            });
            innerAudioContext.play();
          };
          mediaRecorder.start();
        }}
        style={{
          marginTop: 100,
        }}
      >
        PC Record
      </View>

      <View
        onClick={async () => {
          ref2.current?.stop();
        }}
        style={{
          marginTop: 100,
        }}
      >
        PC Record Stop
      </View>
      <Button
        onTouchStart={(event) => {
          Taro.vibrateShort();
          console.log("touchstart", event);
        }}
        onTouchEnd={(event) => {
          console.log("touchend", event);
        }}
        onTouchMove={async (event) => {
          const bounding = await getBoundingRect(`#${event.currentTarget.id}`);
          console.log("touchmove", event.currentTarget, bounding);
        }}
        onTouchCancel={(event) => {
          console.log("touchcancel", event);
        }}
      >
        Test...
      </Button>

      <Button
        onClick={() => {
          ref11.current = getRecorderManager();
          ref11.current.on(RecorderEvent.START, () => {
            console.log("11-----START");
          });
          ref11.current.on(RecorderEvent.PAUSE, () => {
            console.log("11-----PAUSE");
          });
          ref11.current.on(RecorderEvent.RESUME, () => {
            console.log("11-----RESUME");
          });
          ref11.current.on(RecorderEvent.INTERRUPT, () => {
            console.log("11-----INTERRUPT");
          });
          ref11.current.on(RecorderEvent.ERROR, (event) => {
            console.log("11-----RESUME", event);
          });
          ref11.current.on(RecorderEvent.VOLUME, (event) => {
            console.log("11-----VOLUME", event);
            setVolume(event.volume * 5);
          });
          ref11.current.on(RecorderEvent.STOP, async (event) => {
            console.log("11-----STOP", event);

            let filePath = event.tempFilePath;
            playAudio(filePath);
            Taro.uploadFile({
              url: "https://api-bot-boe.bytedance.net/v1/audio/translations",
              name: "file",
              fileName: "recorder.wav",
              filePath: filePath,
              withCredentials: false,
              header: {
                Authorization:
                  "Bearer pat_QuovnjD6OSxoBE8WSpTSKqCkQYq8LfHkrlE1DBPyYON0ejAC71icvWd14Tp30CMg",
                "x-tt-env": "boe_coze_voice_chat",
              },
              success(res) {
                console.log(res);
              },
              fail(res) {
                console.log(res);
              },
            });
          });
          ref11.current.start({
            numberOfChannels: 1,
          });
        }}
      >
        Test Recorder Start 11
      </Button>
      <Button
        onClick={() => {
          ref11.current?.pause();
        }}
      >
        Test Recorder Pause 11
      </Button>
      <Button
        onClick={() => {
          ref11.current?.stop();
        }}
      >
        Test Recorder Stop 11
      </Button>

      <Button
        onClick={() => {
          ref12.current = getRecorderManager();
          ref12.current.on(RecorderEvent.START, () => {
            console.log("12-----START");
          });
          ref12.current.on(RecorderEvent.PAUSE, () => {
            console.log("12-----PAUSE");
          });
          ref12.current.on(RecorderEvent.RESUME, () => {
            console.log("12-----RESUME");
          });
          ref12.current.on(RecorderEvent.INTERRUPT, () => {
            console.log("12-----INTERRUPT");
          });
          ref12.current.on(RecorderEvent.ERROR, (event) => {
            console.log("12-----RESUME", event);
          });
          ref12.current.on(RecorderEvent.STOP, (event) => {
            console.log("12-----STOP", event);
          });
          ref12.current.start({
            numberOfChannels: 1,
            format: "aac",
          });
        }}
      >
        Test Recorder Start 12
      </Button>
      <Button
        onClick={() => {
          ref12.current?.pause();
        }}
      >
        Test Recorder Pause 12
      </Button>
      <Button
        onClick={() => {
          ref12.current?.stop();
        }}
      >
        Test Recorder Stop 12
      </Button>

      <AudioInput>Test...</AudioInput>
    </View>
  );
}

function playAudio(filePath: string) {
  const innerAudioContext = Taro.createInnerAudioContext();
  //innerAudioContext.autoplay = true;
  innerAudioContext.src = filePath;
  //innerAudioContext.obeyMuteSwitch = false;
  innerAudioContext.onPlay(() => {
    console.log("innerAudioContext onPlay");
  });
  innerAudioContext.onError((res) => {
    console.log(res.errMsg);
    console.log(res.errCode);
  });
  innerAudioContext.onEnded(() => {
    console.log("innerAudioContext onEnded");
  });
  innerAudioContext.play();
}
