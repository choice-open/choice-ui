import { Label, Range, SpringVisualizer } from "@choiceform/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import { motion } from "framer-motion";
import { useState } from "react";

const meta: Meta<typeof SpringVisualizer> = {
  title: "Utilities/SpringVisualizer",
  component: SpringVisualizer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "beta"],
};

export default meta;

type Story = StoryObj<typeof SpringVisualizer>;

export const Basic: Story = {
  render: function Render() {
    const [stiffness, setStiffness] = useState(300);
    const [damping, setDamping] = useState(30);
    const [mass, setMass] = useState(1);
    const [delay, setDelay] = useState(0);
    const [key, setKey] = useState(0);

    const handleClick = () => {
      setKey((prevKey) => prevKey + 1);
    };

    return (
      <div className="grid grid-cols-[1fr_2fr] gap-8">
        <div className="grid gap-4">
          <Label>Stiffness</Label>
          <Range
            value={stiffness}
            min={1}
            max={1000}
            onChange={(value) => setStiffness(value)}
          />
          <Label>Damping</Label>
          <Range
            value={damping}
            min={0}
            max={100}
            onChange={(value) => setDamping(value)}
          />
          <Label>Mass</Label>
          <Range
            value={mass}
            min={0.1}
            max={10}
            step={0.1}
            onChange={(value) => setMass(value)}
          />
          <Label>Delay</Label>
          <Range
            value={delay}
            min={0}
            max={10}
            step={0.1}
            onChange={(value) => setDelay(value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <SpringVisualizer
            stiffness={stiffness}
            damping={damping}
            mass={mass}
            delay={delay}
          />
          <span>Click the spring to see the animation</span>
          <div
            className="bg-secondary-background relative h-10 w-64 rounded-lg"
            onClick={handleClick}
          >
            <motion.div
              key={`${stiffness}-${damping}-${mass}-${delay}-${key}`}
              initial={{ x: 0 }}
              animate={{ x: 256 - 32 - 8 }}
              transition={{
                type: "spring",
                stiffness: stiffness,
                damping: damping,
                mass: mass,
                delay: delay,
              }}
              className="absolute top-1 left-1 size-8 rounded-md bg-white shadow-xs"
            />
          </div>
        </div>
      </div>
    );
  },
};

export const TimeMode: Story = {
  name: "Time-based",
  render: function Render() {
    const [duration, setDuration] = useState(0.8);
    const [bounce, setBounce] = useState(0.3);
    const [delay, setDelay] = useState(0);
    const [key, setKey] = useState(0);

    const handleClick = () => {
      setKey((prevKey) => prevKey + 1);
    };

    return (
      <div className="grid grid-cols-[1fr_2fr] gap-8">
        <div className="grid gap-4">
          <Label>Duration (s)</Label>
          <Range
            value={duration}
            min={0}
            max={5}
            step={0.1}
            onChange={(value) => setDuration(value)}
          />

          <Label>Bounce</Label>
          <Range
            value={bounce}
            min={0}
            max={1}
            step={0.05}
            onChange={(value) => setBounce(value)}
          />

          <Label>Delay</Label>
          <Range
            value={delay}
            min={0}
            max={10}
            step={0.1}
            onChange={(value) => setDelay(value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <SpringVisualizer
            mode="time"
            duration={duration}
            bounce={bounce}
            delay={delay}
          />
          <span>Click the track to trigger the animation</span>
          <div
            className="bg-secondary-background relative h-10 w-64 rounded-lg"
            onClick={handleClick}
          >
            <motion.div
              key={`${duration}-${bounce}-${delay}-${key}`}
              initial={{ x: 0 }}
              animate={{ x: 256 - 32 - 8 }}
              transition={{
                type: "spring",
                duration: duration,
                bounce: bounce,
                delay: delay,
              }}
              className="absolute top-1 left-1 size-8 rounded-md bg-white shadow-xs"
            />
          </div>
        </div>
      </div>
    );
  },
};
