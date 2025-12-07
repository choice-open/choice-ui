const fs = require("fs");
const path = require("path");

// 模拟从 Web 下载的 JSON 配置
const mockThemeConfig = {
  baseColors: {
    light: {
      "brand-100": [224, 231, 255],
      "brand-500": [79, 70, 229],
      "brand-600": [67, 56, 202],
      "brand-950": [30, 27, 75],
    },
  },
  semanticConfig: {
    light: {
      "text-accent": "brand-600",
      "background-selected": "brand-100",
    },
  },
};

function generateColorsFile(config) {
  // 这里是一个简化的模板生成器
  // 在实际 CLI 中，这里会包含完整的 colors.cjs 结构

  const content = `
const baseColorsLight = ${JSON.stringify(config.baseColors.light, null, 2)};

const semanticColorsLight = ${JSON.stringify(config.semanticConfig.light, null, 2)};

// ... 其他部分保持默认或从 config 读取 ...

module.exports = {
  baseColorsLight,
  semanticColorsLight,
  // ...
};
`;

  return content;
}

// 模拟写入
const outputPath = path.join(__dirname, "colors-preview.cjs");
fs.writeFileSync(outputPath, generateColorsFile(mockThemeConfig));

console.log(`✅ Preview file generated at: ${outputPath}`);
console.log("此脚本验证了从 JSON 配置生成 colors.cjs 源码的可行性。");
