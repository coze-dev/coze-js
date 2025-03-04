import { useState, useEffect, useRef } from 'react';

import { type Message } from 'console-feed/lib/definitions/Component';
import { Console, Hook, Unhook } from 'console-feed';
import { Button } from 'antd';
import {
  ClearOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';

const ConsoleLog = () => {
  const [logs, setLogs] = useState<unknown[]>([]);
  const [maxHeight, setMaxHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Listen for window size changes
  useEffect(() => {
    const handleResize = () => {
      if (headerRef.current) {
        const headerRect = headerRef.current.getBoundingClientRect();
        setMaxHeight(window.innerHeight - headerRect.top);
      }
    };
    const t = setInterval(() => {
      handleResize;
    }, 5000);

    handleResize();
    return () => clearInterval(t);
  }, [headerRef.current]);

  // run once!
  useEffect(() => {
    const hookedConsole = Hook(
      window.console,
      (log: unknown) => {
        if (!isPaused) {
          setLogs(currLogs => [log, ...currLogs]);
        }
      },
      false,
      200,
    );
    return () => {
      Unhook(hookedConsole);
      return;
    };
  }, [isPaused]);

  const handleClear = () => {
    setLogs([]);
  };

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div>
      <div
        id="console-log-header"
        ref={headerRef}
        style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}
      >
        <Button
          type="text"
          icon={isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
          onClick={handleTogglePause}
        />
        <Button
          type="text"
          icon={<ClearOutlined />}
          onClick={handleClear}
          style={{ marginRight: '10px' }}
        />
      </div>
      <div style={{ maxHeight, overflow: 'auto' }}>
        <Console logs={logs as Message[]} variant="light" />
      </div>
    </div>
  );
};

export { ConsoleLog };
