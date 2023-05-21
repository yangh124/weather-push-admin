module.exports = {
    "env": {
        "browser": true,
        "node":true,
        "es6":true
    },
    "extends": [
        "plugin:vue/vue3-essential",
        "google"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        // 使用 "off", "warn", "error"
    "no-console": "warn",
    // 使用数字（不推荐，语义不明确）
    "for-direction": 1,
    // 数组语法，但没有额外配置项
    "no-else-return": ["error"],
    // 数组语法，一个配置项
    "eqeqeq":["error","always"],
    // 数组语法，多个配置项
    "quotes": ["error", "double", { "avoidEscape": true }]
    }
}
