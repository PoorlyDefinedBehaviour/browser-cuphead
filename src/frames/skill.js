"use strict";

const skill_frames = {
  ray: ["../../assets/resized/cuphead_ray_optimized.png"],
  missile: [
    "../../assets/Cagney/Firing Seeds/Seed Missiles/Blue/resized/Missile_B_01_optimized.png",
    "../../assets/Cagney/Firing Seeds/Seed Missiles/Blue/resized/Missile_B_02_optimized.png",
    "../../assets/Cagney/Firing Seeds/Seed Missiles/Blue/resized/Missile_B_03_optimized.png",
    "../../assets/Cagney/Firing Seeds/Seed Missiles/Blue/resized/Missile_B_04_optimized.png",
    "../../assets/Cagney/Firing Seeds/Seed Missiles/Blue/resized/Missile_B_05_optimized.png",
    "../../assets/Cagney/Firing Seeds/Seed Missiles/Blue/resized/Missile_B_06_optimized.png"
  ],
  seed_missile: [
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_01_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_02_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_03_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_04_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_05_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_06_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_07_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_08_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_09_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_10_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_11_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_12_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_13_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_14_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_15_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_16_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_17_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/Seed/resized/Seed_Fall_A_18_optimized.png"
  ],
  pollen: [
    "../../assets/Cagney/Pollen/resized/Pollen_A_1_optimized.png",
    "../../assets/Cagney/Pollen/resized/Pollen_A_2_optimized.png",
    "../../assets/Cagney/Pollen/resized/Pollen_A_3_optimized.png",
    "../../assets/Cagney/Pollen/resized/Pollen_A_4_optimized.png"
  ],
  boomerang: [
    "../../assets/Cagney/Creating Object/Boomerang/resized/Boomerang_01_optimized.png",
    "../../assets/Cagney/Creating Object/Boomerang/resized/Boomerang_02_optimized.png",
    "../../assets/Cagney/Creating Object/Boomerang/resized/Boomerang_03_optimized.png",
    "../../assets/Cagney/Creating Object/Boomerang/resized/Boomerang_04_optimized.png",
    "../../assets/Cagney/Creating Object/Boomerang/resized/Boomerang_05_optimized.png",
    "../../assets/Cagney/Creating Object/Boomerang/resized/Boomerang_06_optimized.png",
    "../../assets/Cagney/Creating Object/Boomerang/resized/Boomerang_07_optimized.png",
    "../../assets/Cagney/Creating Object/Boomerang/resized/Boomerang_08_optimized.png"
  ],
  venus: [
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_01_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_02_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_03_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_04_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_05_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_06_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_07_A_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_07_B_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_08_A_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_08_B_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_08_C_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_09_A_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_09_B_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_10_A_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_10_B_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_11_A_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_11_B_optimized.png",
    "../../assets/Cagney/Firing Seeds/Venus Flytrap/resized/Venus_12_optimized.png"
  ]
};
