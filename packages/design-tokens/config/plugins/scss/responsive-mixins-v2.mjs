export default function scssResponsiveMixinsV2() {
  return {
    name: "scss-responsive-mixins-v2",
    enforce: "post",

    async build({ tokens, getTransforms, outputFile }) {
      try {
        const output = [];

        // 添加 sass:math 导入
        output.push('@use "sass:math";');
        output.push("");

        // 添加 Responsive Mixins 部分
        output.push(
          "// ============================================================================"
        );
        output.push("// Responsive & Breakpoint Mixins - 响应式和断点 Mixins");
        output.push("// 与 CSS-in-JS 版本功能完全一致，提供 SCSS mixin 接口");
        output.push(
          "// ============================================================================"
        );
        output.push("");

        // 断点数据（硬编码以保持一致性）
        const breakpoints = {
          xs: 475,
          sm: 640,
          md: 768,
          lg: 1024,
          xl: 1280,
          "2xl": 1536,
        };

        output.push("/// 断点值映射");
        output.push("$breakpoints: (");
        Object.entries(breakpoints).forEach(([name, value], index, arr) => {
          const isLast = index === arr.length - 1;
          output.push(`  "${name}": ${value}px${isLast ? "" : ","}`);
        });
        output.push(") !default;");
        output.push("");

        // min-width 媒体查询 mixin
        output.push("/// 生成 min-width 媒体查询");
        output.push("/// @param {String} $breakpoint - 断点名称或数值");
        output.push(
          "/// @param {String} $type - 媒体查询类型，默认为 'screen'"
        );
        output.push("/// @example");
        output.push("///   @include up('md') {");
        output.push("///     display: block;");
        output.push("///   }");
        output.push("@mixin up($breakpoint, $type: 'screen') {");
        output.push("  $value: null;");
        output.push("  ");
        output.push("  @if type-of($breakpoint) == number {");
        output.push("    $value: $breakpoint;");
        output.push("  } @else if map-has-key($breakpoints, $breakpoint) {");
        output.push("    $value: map-get($breakpoints, $breakpoint);");
        output.push("  } @else {");
        output.push(
          "    @error \"断点 '#{$breakpoint}' 不存在。可用断点: #{map-keys($breakpoints)}\";"
        );
        output.push("  }");
        output.push("  ");
        output.push("  $rem-value: math.div($value, 1px) / 16 * 1rem;");
        output.push("  @media #{$type} and (min-width: #{$rem-value}) {");
        output.push("    @content;");
        output.push("  }");
        output.push("}");
        output.push("");

        // max-width 媒体查询 mixin
        output.push("/// 生成 max-width 媒体查询");
        output.push("/// @param {String} $breakpoint - 断点名称或数值");
        output.push(
          "/// @param {String} $type - 媒体查询类型，默认为 'screen'"
        );
        output.push("/// @example");
        output.push("///   @include down('md') {");
        output.push("///     display: none;");
        output.push("///   }");
        output.push("@mixin down($breakpoint, $type: 'screen') {");
        output.push("  $value: null;");
        output.push("  ");
        output.push("  @if type-of($breakpoint) == number {");
        output.push("    $value: $breakpoint;");
        output.push("  } @else if map-has-key($breakpoints, $breakpoint) {");
        output.push("    $value: map-get($breakpoints, $breakpoint);");
        output.push("  } @else {");
        output.push(
          "    @error \"断点 '#{$breakpoint}' 不存在。可用断点: #{map-keys($breakpoints)}\";"
        );
        output.push("  }");
        output.push("  ");
        output.push("  $rem-value: (math.div($value, 1px) - 0.02) / 16 * 1rem;");
        output.push("  @media #{$type} and (max-width: #{$rem-value}) {");
        output.push("    @content;");
        output.push("  }");
        output.push("}");
        output.push("");

        // 范围媒体查询 mixin
        output.push("/// 生成范围媒体查询 (min-width 和 max-width)");
        output.push("/// @param {String} $min-breakpoint - 最小断点");
        output.push("/// @param {String} $max-breakpoint - 最大断点");
        output.push(
          "/// @param {String} $type - 媒体查询类型，默认为 'screen'"
        );
        output.push("/// @example");
        output.push("///   @include between('sm', 'lg') {");
        output.push("///     padding: 2rem;");
        output.push("///   }");
        output.push(
          "@mixin between($min-breakpoint, $max-breakpoint, $type: 'screen') {"
        );
        output.push("  $min-value: null;");
        output.push("  $max-value: null;");
        output.push("  ");
        output.push("  @if type-of($min-breakpoint) == number {");
        output.push("    $min-value: $min-breakpoint;");
        output.push(
          "  } @else if map-has-key($breakpoints, $min-breakpoint) {"
        );
        output.push("    $min-value: map-get($breakpoints, $min-breakpoint);");
        output.push("  } @else {");
        output.push(
          "    @error \"最小断点 '#{$min-breakpoint}' 不存在。可用断点: #{map-keys($breakpoints)}\";"
        );
        output.push("  }");
        output.push("  ");
        output.push("  @if type-of($max-breakpoint) == number {");
        output.push("    $max-value: $max-breakpoint;");
        output.push(
          "  } @else if map-has-key($breakpoints, $max-breakpoint) {"
        );
        output.push("    $max-value: map-get($breakpoints, $max-breakpoint);");
        output.push("  } @else {");
        output.push(
          "    @error \"最大断点 '#{$max-breakpoint}' 不存在。可用断点: #{map-keys($breakpoints)}\";"
        );
        output.push("  }");
        output.push("  ");
        output.push("  $min-rem: math.div($min-value, 1px) / 16 * 1rem;");
        output.push("  $max-rem: (math.div($max-value, 1px) - 0.02) / 16 * 1rem;");
        output.push("  ");
        output.push(
          "  @media #{$type} and (min-width: #{$min-rem}) and (max-width: #{$max-rem}) {"
        );
        output.push("    @content;");
        output.push("  }");
        output.push("}");
        output.push("");

        // 精确断点查询 mixin
        output.push("/// 生成精确断点媒体查询 (只在特定断点范围内)");
        output.push("/// @param {String} $breakpoint - 断点名称");
        output.push(
          "/// @param {String} $type - 媒体查询类型，默认为 'screen'"
        );
        output.push("/// @example");
        output.push("///   @include only('md') {");
        output.push("///     font-size: 1.2rem;");
        output.push("///   }");
        output.push("@mixin only($breakpoint, $type: 'screen') {");
        output.push("  @if not map-has-key($breakpoints, $breakpoint) {");
        output.push(
          "    @error \"断点 '#{$breakpoint}' 不存在。可用断点: #{map-keys($breakpoints)}\";"
        );
        output.push("  }");
        output.push("  ");
        output.push("  $breakpoint-keys: map-keys($breakpoints);");
        output.push("  $current-index: index($breakpoint-keys, $breakpoint);");
        output.push("  ");
        output.push("  @if $current-index == length($breakpoint-keys) {");
        output.push("    // 如果是最大的断点，只使用 min-width");
        output.push("    @include up($breakpoint, $type) {");
        output.push("      @content;");
        output.push("    }");
        output.push("  } @else {");
        output.push("    // 使用下一个断点作为上界");
        output.push(
          "    $next-breakpoint: nth($breakpoint-keys, $current-index + 1);"
        );
        output.push(
          "    @include between($breakpoint, $next-breakpoint, $type) {"
        );
        output.push("      @content;");
        output.push("    }");
        output.push("  }");
        output.push("}");
        output.push("");

        // 设备专用 mixins
        output.push("/// 移动设备优先的媒体查询（xs 及以上）");
        output.push("/// @example");
        output.push("///   @include mobile {");
        output.push("///     font-size: 0.875rem;");
        output.push("///   }");
        output.push("@mixin mobile {");
        output.push("  @include up('xs') {");
        output.push("    @content;");
        output.push("  }");
        output.push("}");
        output.push("");

        output.push("/// 平板设备媒体查询（md 到 lg）");
        output.push("/// @example");
        output.push("///   @include tablet {");
        output.push("///     padding: 1.5rem;");
        output.push("///   }");
        output.push("@mixin tablet {");
        output.push("  @include between('md', 'lg') {");
        output.push("    @content;");
        output.push("  }");
        output.push("}");
        output.push("");

        output.push("/// 桌面设备媒体查询（lg 及以上）");
        output.push("/// @example");
        output.push("///   @include desktop {");
        output.push("///     display: grid;");
        output.push("///   }");
        output.push("@mixin desktop {");
        output.push("  @include up('lg') {");
        output.push("    @content;");
        output.push("  }");
        output.push("}");
        output.push("");

        output.push("/// 打印媒体查询");
        output.push("/// @example");
        output.push("///   @include print {");
        output.push("///     display: none;");
        output.push("///   }");
        output.push("@mixin print {");
        output.push("  @media print {");
        output.push("    @content;");
        output.push("  }");
        output.push("}");
        output.push("");

        // 容器查询相关 mixins
        output.push("/// 容器最大宽度 mixin");
        output.push("/// @param {String} $breakpoint - 断点名称");
        output.push("/// @example");
        output.push("///   .container {");
        output.push("///     @include container-max-width('lg');");
        output.push("///   }");
        output.push("@mixin container-max-width($breakpoint) {");
        output.push("  @if not map-has-key($breakpoints, $breakpoint) {");
        output.push(
          "    @error \"断点 '#{$breakpoint}' 不存在。可用断点: #{map-keys($breakpoints)}\";"
        );
        output.push("  }");
        output.push("  ");
        output.push("  $value: map-get($breakpoints, $breakpoint);");
        output.push("  $container-padding: 32; // 默认容器内边距 (px)");
        output.push("  ");
        output.push("  max-width: #{(math.div($value, 1px) - $container-padding) / 16 * 1rem};");
        output.push("  margin-left: auto;");
        output.push("  margin-right: auto;");
        output.push("}");
        output.push("");

        // 响应式工具 mixin
        output.push("/// 响应式值 mixin - 在不同断点应用不同的值");
        output.push("/// @param {String} $property - CSS 属性名");
        output.push("/// @param {Map} $values - 断点和值的映射");
        output.push("/// @example");
        output.push("///   .title {");
        output.push("///     @include responsive-property('font-size', (");
        output.push("///       'xs': 1.5rem,");
        output.push("///       'md': 2rem,");
        output.push("///       'lg': 2.5rem");
        output.push("///     ));");
        output.push("///   }");
        output.push("@mixin responsive-property($property, $values) {");
        output.push("  @each $breakpoint, $value in $values {");
        output.push(
          "    @if $breakpoint == 'base' or $breakpoint == 'default' {"
        );
        output.push("      #{$property}: #{$value};");
        output.push("    } @else {");
        output.push("      @include up($breakpoint) {");
        output.push("        #{$property}: #{$value};");
        output.push("      }");
        output.push("    }");
        output.push("  }");
        output.push("}");
        output.push("");

        // 清理并重新初始化全局状态（只保留响应式 mixins）
        if (!global.designTokensHelpers) {
          global.designTokensHelpers = {};
        }
        // 重置 mixins 数组，只包含响应式 mixins
        global.designTokensHelpers.scssMixins = [];
        global.designTokensHelpers.scssMixins.push({
          name: "responsive",
          content: output.join("\n"),
        });

        console.log("✅ SCSS 响应式 mixins 已生成");
      } catch (error) {
        console.warn(
          "[scss-responsive-mixins-v2] 生成响应式 mixins 时出错:",
          error.message
        );
      }
    },
  };
}
