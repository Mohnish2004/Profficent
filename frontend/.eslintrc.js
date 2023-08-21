module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "plugin:react/recommended"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "double"],
        "no-duplicate-imports": ["error"],
        "no-unused-vars": ["error"],
        "curly": ["error"],
        "eqeqeq": ["error", "smart"],
        "no-unused-expressions": ["error"],
        "no-var": ["error"],
        "prefer-const": ["error"],
        "sort-imports": ["error", {
            "ignoreCase": true,
            "ignoreDeclarationSort": true,
            "ignoreMemberSort": false,
            "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
            "allowSeparatedGroups": false
        }],
        "one-var-declaration-per-line": ["error", "initializations"],
        "spaced-comment": ["error", "always", { "exceptions": ["-", "+"] }],
        "block-spacing": ["error", "always"],
        "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
        "computed-property-spacing": ["error", "never"],
        "eol-last": ["error", "never"],
        "func-call-spacing": ["error", "never"],
        "indent": ["error", 4],
        "jsx-quotes": ["error", "prefer-double"],
        "key-spacing": ["error", { "afterColon": true }],
        // "line-comment-position": ["error", { "position": "above" }],
        "lines-around-comment": ["error", { "beforeBlockComment": true }],
        "no-extra-parens": ["error"],
        "no-trailing-spaces": ["error"],
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react/no-unescaped-entities": "off",
    }
};