import {
    append,
    arrayIsEqualTo,
    binarySearch,
    CharacterCodes,
    CommentDirective,
    CommentDirectiveType,
    CommentKind,
    CommentRange,
    compareValues,
    Debug,
    DiagnosticMessage,
    Diagnostics,
    forEach,
    getNameOfScriptTarget,
    getSpellingSuggestion,
    identity,
    JSDocParsingMode,
    JSDocSyntaxKind,
    JsxTokenSyntaxKind,
    KeywordSyntaxKind,
    LanguageFeatureMinimumTarget,
    LanguageVariant,
    LineAndCharacter,
    MapLike,
    parsePseudoBigInt,
    positionIsSynthesized,
    PunctuationOrKeywordSyntaxKind,
    RegularExpressionFlags,
    ScriptKind,
    ScriptTarget,
    SourceFileLike,
    SyntaxKind,
    TextRange,
    TokenFlags,
} from "./_namespaces/ts.js";

export type ErrorCallback = (message: DiagnosticMessage, length: number, arg0?: any) => void;

/** @internal */
export function tokenIsIdentifierOrKeyword(token: SyntaxKind): boolean {
    return token >= SyntaxKind.Identifier;
}

/** @internal */
export function tokenIsIdentifierOrKeywordOrGreaterThan(token: SyntaxKind): boolean {
    return token === SyntaxKind.GreaterThanToken || tokenIsIdentifierOrKeyword(token);
}

export interface Scanner {
    /** @deprecated use {@link getTokenFullStart} */
    getStartPos(): number;
    getToken(): SyntaxKind;
    getTokenFullStart(): number;
    getTokenStart(): number;
    getTokenEnd(): number;
    /** @deprecated use {@link getTokenEnd} */
    getTextPos(): number;
    /** @deprecated use {@link getTokenStart} */
    getTokenPos(): number;
    getTokenText(): string;
    getTokenValue(): string;
    hasUnicodeEscape(): boolean;
    hasExtendedUnicodeEscape(): boolean;
    hasPrecedingLineBreak(): boolean;
    /** @internal */
    hasPrecedingJSDocComment(): boolean;
    isIdentifier(): boolean;
    isReservedWord(): boolean;
    isUnterminated(): boolean;
    /** @internal */
    getNumericLiteralFlags(): TokenFlags;
    /** @internal */
    getCommentDirectives(): CommentDirective[] | undefined;
    /** @internal */
    getTokenFlags(): TokenFlags;
    reScanGreaterToken(): SyntaxKind;
    reScanSlashToken(): SyntaxKind;
    /** @internal */
    reScanSlashToken(reportErrors?: boolean): SyntaxKind; // eslint-disable-line @typescript-eslint/unified-signatures
    reScanAsteriskEqualsToken(): SyntaxKind;
    reScanTemplateToken(isTaggedTemplate: boolean): SyntaxKind;
    /** @deprecated use {@link reScanTemplateToken}(false) */
    reScanTemplateHeadOrNoSubstitutionTemplate(): SyntaxKind;
    scanJsxIdentifier(): SyntaxKind;
    scanJsxAttributeValue(): SyntaxKind;
    reScanJsxAttributeValue(): SyntaxKind;
    reScanJsxToken(allowMultilineJsxText?: boolean): JsxTokenSyntaxKind;
    reScanLessThanToken(): SyntaxKind;
    reScanHashToken(): SyntaxKind;
    reScanQuestionToken(): SyntaxKind;
    reScanInvalidIdentifier(): SyntaxKind;
    scanJsxToken(): JsxTokenSyntaxKind;
    scanJsDocToken(): JSDocSyntaxKind;
    /** @internal */
    scanJSDocCommentTextToken(inBackticks: boolean): JSDocSyntaxKind | SyntaxKind.JSDocCommentTextToken;
    scan(): SyntaxKind;

    getText(): string;
    /** @internal */
    clearCommentDirectives(): void;
    // Sets the text for the scanner to scan.  An optional subrange starting point and length
    // can be provided to have the scanner only scan a portion of the text.
    setText(text: string | undefined, start?: number, length?: number): void;
    setOnError(onError: ErrorCallback | undefined): void;
    setScriptTarget(scriptTarget: ScriptTarget): void;
    setLanguageVariant(variant: LanguageVariant): void;
    setScriptKind(scriptKind: ScriptKind): void;
    setJSDocParsingMode(kind: JSDocParsingMode): void;
    /** @deprecated use {@link resetTokenState} */
    setTextPos(textPos: number): void;
    resetTokenState(pos: number): void;
    /** @internal */
    setSkipJsDocLeadingAsterisks(skip: boolean): void;
    // Invokes the provided callback then unconditionally restores the scanner to the state it
    // was in immediately prior to invoking the callback.  The result of invoking the callback
    // is returned from this function.
    lookAhead<T>(callback: () => T): T;

    // Invokes the callback with the scanner set to scan the specified range. When the callback
    // returns, the scanner is restored to the state it was in before scanRange was called.
    scanRange<T>(start: number, length: number, callback: () => T): T;

    // Invokes the provided callback.  If the callback returns something falsy, then it restores
    // the scanner to the state it was in immediately prior to invoking the callback.  If the
    // callback returns something truthy, then the scanner state is not rolled back.  The result
    // of invoking the callback is returned from this function.
    tryScan<T>(callback: () => T): T;
}

/** @internal */
export const textToKeywordObj: MapLike<KeywordSyntaxKind> = {
    abstract: SyntaxKind.AbstractKeyword,
    accessor: SyntaxKind.AccessorKeyword,
    any: SyntaxKind.AnyKeyword,
    as: SyntaxKind.AsKeyword,
    asserts: SyntaxKind.AssertsKeyword,
    assert: SyntaxKind.AssertKeyword,
    bigint: SyntaxKind.BigIntKeyword,
    boolean: SyntaxKind.BooleanKeyword,
    break: SyntaxKind.BreakKeyword,
    case: SyntaxKind.CaseKeyword,
    catch: SyntaxKind.CatchKeyword,
    class: SyntaxKind.ClassKeyword,
    continue: SyntaxKind.ContinueKeyword,
    const: SyntaxKind.ConstKeyword,
    ["" + "constructor"]: SyntaxKind.ConstructorKeyword,
    debugger: SyntaxKind.DebuggerKeyword,
    declare: SyntaxKind.DeclareKeyword,
    default: SyntaxKind.DefaultKeyword,
    delete: SyntaxKind.DeleteKeyword,
    do: SyntaxKind.DoKeyword,
    else: SyntaxKind.ElseKeyword,
    enum: SyntaxKind.EnumKeyword,
    export: SyntaxKind.ExportKeyword,
    extends: SyntaxKind.ExtendsKeyword,
    false: SyntaxKind.FalseKeyword,
    finally: SyntaxKind.FinallyKeyword,
    for: SyntaxKind.ForKeyword,
    from: SyntaxKind.FromKeyword,
    function: SyntaxKind.FunctionKeyword,
    get: SyntaxKind.GetKeyword,
    if: SyntaxKind.IfKeyword,
    implements: SyntaxKind.ImplementsKeyword,
    import: SyntaxKind.ImportKeyword,
    in: SyntaxKind.InKeyword,
    infer: SyntaxKind.InferKeyword,
    instanceof: SyntaxKind.InstanceOfKeyword,
    interface: SyntaxKind.InterfaceKeyword,
    intrinsic: SyntaxKind.IntrinsicKeyword,
    is: SyntaxKind.IsKeyword,
    keyof: SyntaxKind.KeyOfKeyword,
    let: SyntaxKind.LetKeyword,
    module: SyntaxKind.ModuleKeyword,
    namespace: SyntaxKind.NamespaceKeyword,
    never: SyntaxKind.NeverKeyword,
    new: SyntaxKind.NewKeyword,
    null: SyntaxKind.NullKeyword,
    number: SyntaxKind.NumberKeyword,
    object: SyntaxKind.ObjectKeyword,
    package: SyntaxKind.PackageKeyword,
    private: SyntaxKind.PrivateKeyword,
    protected: SyntaxKind.ProtectedKeyword,
    public: SyntaxKind.PublicKeyword,
    override: SyntaxKind.OverrideKeyword,
    out: SyntaxKind.OutKeyword,
    readonly: SyntaxKind.ReadonlyKeyword,
    require: SyntaxKind.RequireKeyword,
    global: SyntaxKind.GlobalKeyword,
    return: SyntaxKind.ReturnKeyword,
    satisfies: SyntaxKind.SatisfiesKeyword,
    set: SyntaxKind.SetKeyword,
    static: SyntaxKind.StaticKeyword,
    string: SyntaxKind.StringKeyword,
    super: SyntaxKind.SuperKeyword,
    switch: SyntaxKind.SwitchKeyword,
    symbol: SyntaxKind.SymbolKeyword,
    this: SyntaxKind.ThisKeyword,
    throw: SyntaxKind.ThrowKeyword,
    true: SyntaxKind.TrueKeyword,
    try: SyntaxKind.TryKeyword,
    type: SyntaxKind.TypeKeyword,
    typeof: SyntaxKind.TypeOfKeyword,
    undefined: SyntaxKind.UndefinedKeyword,
    unique: SyntaxKind.UniqueKeyword,
    unknown: SyntaxKind.UnknownKeyword,
    using: SyntaxKind.UsingKeyword,
    var: SyntaxKind.VarKeyword,
    void: SyntaxKind.VoidKeyword,
    while: SyntaxKind.WhileKeyword,
    with: SyntaxKind.WithKeyword,
    yield: SyntaxKind.YieldKeyword,
    async: SyntaxKind.AsyncKeyword,
    await: SyntaxKind.AwaitKeyword,
    of: SyntaxKind.OfKeyword,
};

const textToKeyword = new Map(Object.entries(textToKeywordObj));

const textToToken = new Map(Object.entries({
    ...textToKeywordObj,
    "{": SyntaxKind.OpenBraceToken,
    "}": SyntaxKind.CloseBraceToken,
    "(": SyntaxKind.OpenParenToken,
    ")": SyntaxKind.CloseParenToken,
    "[": SyntaxKind.OpenBracketToken,
    "]": SyntaxKind.CloseBracketToken,
    ".": SyntaxKind.DotToken,
    "...": SyntaxKind.DotDotDotToken,
    ";": SyntaxKind.SemicolonToken,
    ",": SyntaxKind.CommaToken,
    "<": SyntaxKind.LessThanToken,
    ">": SyntaxKind.GreaterThanToken,
    "<=": SyntaxKind.LessThanEqualsToken,
    ">=": SyntaxKind.GreaterThanEqualsToken,
    "==": SyntaxKind.EqualsEqualsToken,
    "!=": SyntaxKind.ExclamationEqualsToken,
    "===": SyntaxKind.EqualsEqualsEqualsToken,
    "!==": SyntaxKind.ExclamationEqualsEqualsToken,
    "=>": SyntaxKind.EqualsGreaterThanToken,
    "+": SyntaxKind.PlusToken,
    "-": SyntaxKind.MinusToken,
    "**": SyntaxKind.AsteriskAsteriskToken,
    "*": SyntaxKind.AsteriskToken,
    "/": SyntaxKind.SlashToken,
    "%": SyntaxKind.PercentToken,
    "++": SyntaxKind.PlusPlusToken,
    "--": SyntaxKind.MinusMinusToken,
    "<<": SyntaxKind.LessThanLessThanToken,
    "</": SyntaxKind.LessThanSlashToken,
    ">>": SyntaxKind.GreaterThanGreaterThanToken,
    ">>>": SyntaxKind.GreaterThanGreaterThanGreaterThanToken,
    "&": SyntaxKind.AmpersandToken,
    "|": SyntaxKind.BarToken,
    "^": SyntaxKind.CaretToken,
    "!": SyntaxKind.ExclamationToken,
    "~": SyntaxKind.TildeToken,
    "&&": SyntaxKind.AmpersandAmpersandToken,
    "||": SyntaxKind.BarBarToken,
    "?": SyntaxKind.QuestionToken,
    "??": SyntaxKind.QuestionQuestionToken,
    "?.": SyntaxKind.QuestionDotToken,
    ":": SyntaxKind.ColonToken,
    "=": SyntaxKind.EqualsToken,
    "+=": SyntaxKind.PlusEqualsToken,
    "-=": SyntaxKind.MinusEqualsToken,
    "*=": SyntaxKind.AsteriskEqualsToken,
    "**=": SyntaxKind.AsteriskAsteriskEqualsToken,
    "/=": SyntaxKind.SlashEqualsToken,
    "%=": SyntaxKind.PercentEqualsToken,
    "<<=": SyntaxKind.LessThanLessThanEqualsToken,
    ">>=": SyntaxKind.GreaterThanGreaterThanEqualsToken,
    ">>>=": SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken,
    "&=": SyntaxKind.AmpersandEqualsToken,
    "|=": SyntaxKind.BarEqualsToken,
    "^=": SyntaxKind.CaretEqualsToken,
    "||=": SyntaxKind.BarBarEqualsToken,
    "&&=": SyntaxKind.AmpersandAmpersandEqualsToken,
    "??=": SyntaxKind.QuestionQuestionEqualsToken,
    "@": SyntaxKind.AtToken,
    "#": SyntaxKind.HashToken,
    "`": SyntaxKind.BacktickToken,
}));

const charCodeToRegExpFlag = new Map<CharacterCodes, RegularExpressionFlags>([
    [CharacterCodes.d, RegularExpressionFlags.HasIndices],
    [CharacterCodes.g, RegularExpressionFlags.Global],
    [CharacterCodes.i, RegularExpressionFlags.IgnoreCase],
    [CharacterCodes.m, RegularExpressionFlags.Multiline],
    [CharacterCodes.s, RegularExpressionFlags.DotAll],
    [CharacterCodes.u, RegularExpressionFlags.Unicode],
    [CharacterCodes.v, RegularExpressionFlags.UnicodeSets],
    [CharacterCodes.y, RegularExpressionFlags.Sticky],
]);

const regExpFlagToFirstAvailableLanguageVersion = new Map<RegularExpressionFlags, LanguageFeatureMinimumTarget>([
    [RegularExpressionFlags.HasIndices, LanguageFeatureMinimumTarget.RegularExpressionFlagsHasIndices],
    [RegularExpressionFlags.DotAll, LanguageFeatureMinimumTarget.RegularExpressionFlagsDotAll],
    [RegularExpressionFlags.Unicode, LanguageFeatureMinimumTarget.RegularExpressionFlagsUnicode],
    [RegularExpressionFlags.UnicodeSets, LanguageFeatureMinimumTarget.RegularExpressionFlagsUnicodeSets],
    [RegularExpressionFlags.Sticky, LanguageFeatureMinimumTarget.RegularExpressionFlagsSticky],
]);

const enum TokenCategory {
    IdentifierOrUnknown = 0,

    /**
     * Single-width tokens whose SyntaxKind value fits
     * in the lower masked bits of the current value.
     */
    SimpleToken = 1 << 8, // must come first
    Whitespace = 1 << 9,
    LineBreak = 1 << 10,
    Digit = 1 << 11,
    /**
     * Not a character that can be generically handled,
     * but needs to be handled in some well-understood way.
     */
    RecognizedMisc = 1 << 12,

    SimpleTokenMask = SimpleToken - 1,
}

const tokenCategoryLookup: TokenCategory[] = [];
const tokenCategoryLookupUncommon = new Map<CharacterCodes, TokenCategory>();
for (let i = 0; i < CharacterCodes.maxAsciiCharacter; i++) {
    tokenCategoryLookup.push(TokenCategory.IdentifierOrUnknown);
}

for (
    const [key, value] of [
        // Line Break Whitespace
        [CharacterCodes.lineFeed, TokenCategory.LineBreak],
        [CharacterCodes.carriageReturn, TokenCategory.LineBreak],
        [CharacterCodes.lineSeparator, TokenCategory.LineBreak],
        [CharacterCodes.paragraphSeparator, TokenCategory.LineBreak],

        // Single Line Whitespace
        [CharacterCodes.space, TokenCategory.Whitespace],
        [CharacterCodes.tab, TokenCategory.Whitespace],
        [CharacterCodes.verticalTab, TokenCategory.Whitespace],
        [CharacterCodes.formFeed, TokenCategory.Whitespace],
        [CharacterCodes.nonBreakingSpace, TokenCategory.Whitespace],
        [CharacterCodes.nextLine, TokenCategory.Whitespace],
        [CharacterCodes.ogham, TokenCategory.Whitespace],
        [CharacterCodes.enQuad, TokenCategory.Whitespace],
        [CharacterCodes.emQuad, TokenCategory.Whitespace],
        [CharacterCodes.enSpace, TokenCategory.Whitespace],
        [CharacterCodes.emSpace, TokenCategory.Whitespace],
        [CharacterCodes.threePerEmSpace, TokenCategory.Whitespace],
        [CharacterCodes.fourPerEmSpace, TokenCategory.Whitespace],
        [CharacterCodes.sixPerEmSpace, TokenCategory.Whitespace],
        [CharacterCodes.figureSpace, TokenCategory.Whitespace],
        [CharacterCodes.punctuationSpace, TokenCategory.Whitespace],
        [CharacterCodes.thinSpace, TokenCategory.Whitespace],
        [CharacterCodes.hairSpace, TokenCategory.Whitespace],
        [CharacterCodes.zeroWidthSpace, TokenCategory.Whitespace],
        [CharacterCodes.narrowNoBreakSpace, TokenCategory.Whitespace],
        [CharacterCodes.mathematicalSpace, TokenCategory.Whitespace],
        [CharacterCodes.ideographicSpace, TokenCategory.Whitespace],
        [CharacterCodes.byteOrderMark, TokenCategory.Whitespace],

        // Simple Single-Character Tokens
        [CharacterCodes.openParen, TokenCategory.SimpleToken | SyntaxKind.OpenParenToken],
        [CharacterCodes.closeParen, TokenCategory.SimpleToken | SyntaxKind.CloseParenToken],
        [CharacterCodes.comma, TokenCategory.SimpleToken | SyntaxKind.CommaToken],
        [CharacterCodes.colon, TokenCategory.SimpleToken | SyntaxKind.ColonToken],
        [CharacterCodes.semicolon, TokenCategory.SimpleToken | SyntaxKind.SemicolonToken],
        [CharacterCodes.openBracket, TokenCategory.SimpleToken | SyntaxKind.OpenBracketToken],
        [CharacterCodes.closeBracket, TokenCategory.SimpleToken | SyntaxKind.CloseBracketToken],
        [CharacterCodes.openBrace, TokenCategory.SimpleToken | SyntaxKind.OpenBraceToken],
        [CharacterCodes.closeBrace, TokenCategory.SimpleToken | SyntaxKind.CloseBraceToken],
        [CharacterCodes.tilde, TokenCategory.SimpleToken | SyntaxKind.TildeToken],
        [CharacterCodes.at, TokenCategory.SimpleToken | SyntaxKind.AtToken],

        // Digits
        [CharacterCodes._0, TokenCategory.Digit],
        [CharacterCodes._1, TokenCategory.Digit],
        [CharacterCodes._2, TokenCategory.Digit],
        [CharacterCodes._3, TokenCategory.Digit],
        [CharacterCodes._4, TokenCategory.Digit],
        [CharacterCodes._5, TokenCategory.Digit],
        [CharacterCodes._6, TokenCategory.Digit],
        [CharacterCodes._7, TokenCategory.Digit],
        [CharacterCodes._8, TokenCategory.Digit],
        [CharacterCodes._9, TokenCategory.Digit],

        [CharacterCodes.exclamation, TokenCategory.RecognizedMisc],
        [CharacterCodes.doubleQuote, TokenCategory.RecognizedMisc],
        [CharacterCodes.singleQuote, TokenCategory.RecognizedMisc],
        [CharacterCodes.backtick, TokenCategory.RecognizedMisc],
        [CharacterCodes.percent, TokenCategory.RecognizedMisc],
        [CharacterCodes.ampersand, TokenCategory.RecognizedMisc],
        [CharacterCodes.asterisk, TokenCategory.RecognizedMisc],
        [CharacterCodes.plus, TokenCategory.RecognizedMisc],
        [CharacterCodes.minus, TokenCategory.RecognizedMisc],
        [CharacterCodes.dot, TokenCategory.RecognizedMisc],
        [CharacterCodes.slash, TokenCategory.RecognizedMisc],
        [CharacterCodes.lessThan, TokenCategory.RecognizedMisc],
        [CharacterCodes.equals, TokenCategory.RecognizedMisc],
        [CharacterCodes.greaterThan, TokenCategory.RecognizedMisc],
        [CharacterCodes.question, TokenCategory.RecognizedMisc],
        [CharacterCodes.caret, TokenCategory.RecognizedMisc],
        [CharacterCodes.bar, TokenCategory.RecognizedMisc],
        [CharacterCodes.backslash, TokenCategory.RecognizedMisc],
        [CharacterCodes.hash, TokenCategory.RecognizedMisc],
        [CharacterCodes.replacementCharacter, TokenCategory.RecognizedMisc],
    ]
) {
    if (key < tokenCategoryLookup.length) {
        tokenCategoryLookup[key] = value;
    }
    else {
        tokenCategoryLookupUncommon.set(key, value);
    }
}

/*
    As per ECMAScript Language Specification 5th Edition, Section 7.6: ISyntaxToken Names and Identifiers
    IdentifierStart ::
        Can contain Unicode 6.2 categories:
        Uppercase letter (Lu),
        Lowercase letter (Ll),
        Titlecase letter (Lt),
        Modifier letter (Lm),
        Other letter (Lo), or
        Letter number (Nl).
    IdentifierPart ::
        Can contain IdentifierStart + Unicode 6.2 categories:
        Non-spacing mark (Mn),
        Combining spacing mark (Mc),
        Decimal number (Nd),
        Connector punctuation (Pc),
        <ZWNJ>, or
        <ZWJ>.

    Codepoint ranges for ES5 Identifiers are extracted from the Unicode 6.2 specification at:
    http://www.unicode.org/Public/6.2.0/ucd/UnicodeData.txt
*/
// dprint-ignore
const unicodeES5IdentifierStart = [170, 170, 181, 181, 186, 186, 192, 214, 216, 246, 248, 705, 710, 721, 736, 740, 748, 748, 750, 750, 880, 884, 886, 887, 890, 893, 902, 902, 904, 906, 908, 908, 910, 929, 931, 1013, 1015, 1153, 1162, 1319, 1329, 1366, 1369, 1369, 1377, 1415, 1488, 1514, 1520, 1522, 1568, 1610, 1646, 1647, 1649, 1747, 1749, 1749, 1765, 1766, 1774, 1775, 1786, 1788, 1791, 1791, 1808, 1808, 1810, 1839, 1869, 1957, 1969, 1969, 1994, 2026, 2036, 2037, 2042, 2042, 2048, 2069, 2074, 2074, 2084, 2084, 2088, 2088, 2112, 2136, 2208, 2208, 2210, 2220, 2308, 2361, 2365, 2365, 2384, 2384, 2392, 2401, 2417, 2423, 2425, 2431, 2437, 2444, 2447, 2448, 2451, 2472, 2474, 2480, 2482, 2482, 2486, 2489, 2493, 2493, 2510, 2510, 2524, 2525, 2527, 2529, 2544, 2545, 2565, 2570, 2575, 2576, 2579, 2600, 2602, 2608, 2610, 2611, 2613, 2614, 2616, 2617, 2649, 2652, 2654, 2654, 2674, 2676, 2693, 2701, 2703, 2705, 2707, 2728, 2730, 2736, 2738, 2739, 2741, 2745, 2749, 2749, 2768, 2768, 2784, 2785, 2821, 2828, 2831, 2832, 2835, 2856, 2858, 2864, 2866, 2867, 2869, 2873, 2877, 2877, 2908, 2909, 2911, 2913, 2929, 2929, 2947, 2947, 2949, 2954, 2958, 2960, 2962, 2965, 2969, 2970, 2972, 2972, 2974, 2975, 2979, 2980, 2984, 2986, 2990, 3001, 3024, 3024, 3077, 3084, 3086, 3088, 3090, 3112, 3114, 3123, 3125, 3129, 3133, 3133, 3160, 3161, 3168, 3169, 3205, 3212, 3214, 3216, 3218, 3240, 3242, 3251, 3253, 3257, 3261, 3261, 3294, 3294, 3296, 3297, 3313, 3314, 3333, 3340, 3342, 3344, 3346, 3386, 3389, 3389, 3406, 3406, 3424, 3425, 3450, 3455, 3461, 3478, 3482, 3505, 3507, 3515, 3517, 3517, 3520, 3526, 3585, 3632, 3634, 3635, 3648, 3654, 3713, 3714, 3716, 3716, 3719, 3720, 3722, 3722, 3725, 3725, 3732, 3735, 3737, 3743, 3745, 3747, 3749, 3749, 3751, 3751, 3754, 3755, 3757, 3760, 3762, 3763, 3773, 3773, 3776, 3780, 3782, 3782, 3804, 3807, 3840, 3840, 3904, 3911, 3913, 3948, 3976, 3980, 4096, 4138, 4159, 4159, 4176, 4181, 4186, 4189, 4193, 4193, 4197, 4198, 4206, 4208, 4213, 4225, 4238, 4238, 4256, 4293, 4295, 4295, 4301, 4301, 4304, 4346, 4348, 4680, 4682, 4685, 4688, 4694, 4696, 4696, 4698, 4701, 4704, 4744, 4746, 4749, 4752, 4784, 4786, 4789, 4792, 4798, 4800, 4800, 4802, 4805, 4808, 4822, 4824, 4880, 4882, 4885, 4888, 4954, 4992, 5007, 5024, 5108, 5121, 5740, 5743, 5759, 5761, 5786, 5792, 5866, 5870, 5872, 5888, 5900, 5902, 5905, 5920, 5937, 5952, 5969, 5984, 5996, 5998, 6000, 6016, 6067, 6103, 6103, 6108, 6108, 6176, 6263, 6272, 6312, 6314, 6314, 6320, 6389, 6400, 6428, 6480, 6509, 6512, 6516, 6528, 6571, 6593, 6599, 6656, 6678, 6688, 6740, 6823, 6823, 6917, 6963, 6981, 6987, 7043, 7072, 7086, 7087, 7098, 7141, 7168, 7203, 7245, 7247, 7258, 7293, 7401, 7404, 7406, 7409, 7413, 7414, 7424, 7615, 7680, 7957, 7960, 7965, 7968, 8005, 8008, 8013, 8016, 8023, 8025, 8025, 8027, 8027, 8029, 8029, 8031, 8061, 8064, 8116, 8118, 8124, 8126, 8126, 8130, 8132, 8134, 8140, 8144, 8147, 8150, 8155, 8160, 8172, 8178, 8180, 8182, 8188, 8305, 8305, 8319, 8319, 8336, 8348, 8450, 8450, 8455, 8455, 8458, 8467, 8469, 8469, 8473, 8477, 8484, 8484, 8486, 8486, 8488, 8488, 8490, 8493, 8495, 8505, 8508, 8511, 8517, 8521, 8526, 8526, 8544, 8584, 11264, 11310, 11312, 11358, 11360, 11492, 11499, 11502, 11506, 11507, 11520, 11557, 11559, 11559, 11565, 11565, 11568, 11623, 11631, 11631, 11648, 11670, 11680, 11686, 11688, 11694, 11696, 11702, 11704, 11710, 11712, 11718, 11720, 11726, 11728, 11734, 11736, 11742, 11823, 11823, 12293, 12295, 12321, 12329, 12337, 12341, 12344, 12348, 12353, 12438, 12445, 12447, 12449, 12538, 12540, 12543, 12549, 12589, 12593, 12686, 12704, 12730, 12784, 12799, 13312, 19893, 19968, 40908, 40960, 42124, 42192, 42237, 42240, 42508, 42512, 42527, 42538, 42539, 42560, 42606, 42623, 42647, 42656, 42735, 42775, 42783, 42786, 42888, 42891, 42894, 42896, 42899, 42912, 42922, 43000, 43009, 43011, 43013, 43015, 43018, 43020, 43042, 43072, 43123, 43138, 43187, 43250, 43255, 43259, 43259, 43274, 43301, 43312, 43334, 43360, 43388, 43396, 43442, 43471, 43471, 43520, 43560, 43584, 43586, 43588, 43595, 43616, 43638, 43642, 43642, 43648, 43695, 43697, 43697, 43701, 43702, 43705, 43709, 43712, 43712, 43714, 43714, 43739, 43741, 43744, 43754, 43762, 43764, 43777, 43782, 43785, 43790, 43793, 43798, 43808, 43814, 43816, 43822, 43968, 44002, 44032, 55203, 55216, 55238, 55243, 55291, 63744, 64109, 64112, 64217, 64256, 64262, 64275, 64279, 64285, 64285, 64287, 64296, 64298, 64310, 64312, 64316, 64318, 64318, 64320, 64321, 64323, 64324, 64326, 64433, 64467, 64829, 64848, 64911, 64914, 64967, 65008, 65019, 65136, 65140, 65142, 65276, 65313, 65338, 65345, 65370, 65382, 65470, 65474, 65479, 65482, 65487, 65490, 65495, 65498, 65500 ];
// dprint-ignore
const unicodeES5IdentifierPart = [170, 170, 181, 181, 186, 186, 192, 214, 216, 246, 248, 705, 710, 721, 736, 740, 748, 748, 750, 750, 768, 884, 886, 887, 890, 893, 902, 902, 904, 906, 908, 908, 910, 929, 931, 1013, 1015, 1153, 1155, 1159, 1162, 1319, 1329, 1366, 1369, 1369, 1377, 1415, 1425, 1469, 1471, 1471, 1473, 1474, 1476, 1477, 1479, 1479, 1488, 1514, 1520, 1522, 1552, 1562, 1568, 1641, 1646, 1747, 1749, 1756, 1759, 1768, 1770, 1788, 1791, 1791, 1808, 1866, 1869, 1969, 1984, 2037, 2042, 2042, 2048, 2093, 2112, 2139, 2208, 2208, 2210, 2220, 2276, 2302, 2304, 2403, 2406, 2415, 2417, 2423, 2425, 2431, 2433, 2435, 2437, 2444, 2447, 2448, 2451, 2472, 2474, 2480, 2482, 2482, 2486, 2489, 2492, 2500, 2503, 2504, 2507, 2510, 2519, 2519, 2524, 2525, 2527, 2531, 2534, 2545, 2561, 2563, 2565, 2570, 2575, 2576, 2579, 2600, 2602, 2608, 2610, 2611, 2613, 2614, 2616, 2617, 2620, 2620, 2622, 2626, 2631, 2632, 2635, 2637, 2641, 2641, 2649, 2652, 2654, 2654, 2662, 2677, 2689, 2691, 2693, 2701, 2703, 2705, 2707, 2728, 2730, 2736, 2738, 2739, 2741, 2745, 2748, 2757, 2759, 2761, 2763, 2765, 2768, 2768, 2784, 2787, 2790, 2799, 2817, 2819, 2821, 2828, 2831, 2832, 2835, 2856, 2858, 2864, 2866, 2867, 2869, 2873, 2876, 2884, 2887, 2888, 2891, 2893, 2902, 2903, 2908, 2909, 2911, 2915, 2918, 2927, 2929, 2929, 2946, 2947, 2949, 2954, 2958, 2960, 2962, 2965, 2969, 2970, 2972, 2972, 2974, 2975, 2979, 2980, 2984, 2986, 2990, 3001, 3006, 3010, 3014, 3016, 3018, 3021, 3024, 3024, 3031, 3031, 3046, 3055, 3073, 3075, 3077, 3084, 3086, 3088, 3090, 3112, 3114, 3123, 3125, 3129, 3133, 3140, 3142, 3144, 3146, 3149, 3157, 3158, 3160, 3161, 3168, 3171, 3174, 3183, 3202, 3203, 3205, 3212, 3214, 3216, 3218, 3240, 3242, 3251, 3253, 3257, 3260, 3268, 3270, 3272, 3274, 3277, 3285, 3286, 3294, 3294, 3296, 3299, 3302, 3311, 3313, 3314, 3330, 3331, 3333, 3340, 3342, 3344, 3346, 3386, 3389, 3396, 3398, 3400, 3402, 3406, 3415, 3415, 3424, 3427, 3430, 3439, 3450, 3455, 3458, 3459, 3461, 3478, 3482, 3505, 3507, 3515, 3517, 3517, 3520, 3526, 3530, 3530, 3535, 3540, 3542, 3542, 3544, 3551, 3570, 3571, 3585, 3642, 3648, 3662, 3664, 3673, 3713, 3714, 3716, 3716, 3719, 3720, 3722, 3722, 3725, 3725, 3732, 3735, 3737, 3743, 3745, 3747, 3749, 3749, 3751, 3751, 3754, 3755, 3757, 3769, 3771, 3773, 3776, 3780, 3782, 3782, 3784, 3789, 3792, 3801, 3804, 3807, 3840, 3840, 3864, 3865, 3872, 3881, 3893, 3893, 3895, 3895, 3897, 3897, 3902, 3911, 3913, 3948, 3953, 3972, 3974, 3991, 3993, 4028, 4038, 4038, 4096, 4169, 4176, 4253, 4256, 4293, 4295, 4295, 4301, 4301, 4304, 4346, 4348, 4680, 4682, 4685, 4688, 4694, 4696, 4696, 4698, 4701, 4704, 4744, 4746, 4749, 4752, 4784, 4786, 4789, 4792, 4798, 4800, 4800, 4802, 4805, 4808, 4822, 4824, 4880, 4882, 4885, 4888, 4954, 4957, 4959, 4992, 5007, 5024, 5108, 5121, 5740, 5743, 5759, 5761, 5786, 5792, 5866, 5870, 5872, 5888, 5900, 5902, 5908, 5920, 5940, 5952, 5971, 5984, 5996, 5998, 6000, 6002, 6003, 6016, 6099, 6103, 6103, 6108, 6109, 6112, 6121, 6155, 6157, 6160, 6169, 6176, 6263, 6272, 6314, 6320, 6389, 6400, 6428, 6432, 6443, 6448, 6459, 6470, 6509, 6512, 6516, 6528, 6571, 6576, 6601, 6608, 6617, 6656, 6683, 6688, 6750, 6752, 6780, 6783, 6793, 6800, 6809, 6823, 6823, 6912, 6987, 6992, 7001, 7019, 7027, 7040, 7155, 7168, 7223, 7232, 7241, 7245, 7293, 7376, 7378, 7380, 7414, 7424, 7654, 7676, 7957, 7960, 7965, 7968, 8005, 8008, 8013, 8016, 8023, 8025, 8025, 8027, 8027, 8029, 8029, 8031, 8061, 8064, 8116, 8118, 8124, 8126, 8126, 8130, 8132, 8134, 8140, 8144, 8147, 8150, 8155, 8160, 8172, 8178, 8180, 8182, 8188, 8204, 8205, 8255, 8256, 8276, 8276, 8305, 8305, 8319, 8319, 8336, 8348, 8400, 8412, 8417, 8417, 8421, 8432, 8450, 8450, 8455, 8455, 8458, 8467, 8469, 8469, 8473, 8477, 8484, 8484, 8486, 8486, 8488, 8488, 8490, 8493, 8495, 8505, 8508, 8511, 8517, 8521, 8526, 8526, 8544, 8584, 11264, 11310, 11312, 11358, 11360, 11492, 11499, 11507, 11520, 11557, 11559, 11559, 11565, 11565, 11568, 11623, 11631, 11631, 11647, 11670, 11680, 11686, 11688, 11694, 11696, 11702, 11704, 11710, 11712, 11718, 11720, 11726, 11728, 11734, 11736, 11742, 11744, 11775, 11823, 11823, 12293, 12295, 12321, 12335, 12337, 12341, 12344, 12348, 12353, 12438, 12441, 12442, 12445, 12447, 12449, 12538, 12540, 12543, 12549, 12589, 12593, 12686, 12704, 12730, 12784, 12799, 13312, 19893, 19968, 40908, 40960, 42124, 42192, 42237, 42240, 42508, 42512, 42539, 42560, 42607, 42612, 42621, 42623, 42647, 42655, 42737, 42775, 42783, 42786, 42888, 42891, 42894, 42896, 42899, 42912, 42922, 43000, 43047, 43072, 43123, 43136, 43204, 43216, 43225, 43232, 43255, 43259, 43259, 43264, 43309, 43312, 43347, 43360, 43388, 43392, 43456, 43471, 43481, 43520, 43574, 43584, 43597, 43600, 43609, 43616, 43638, 43642, 43643, 43648, 43714, 43739, 43741, 43744, 43759, 43762, 43766, 43777, 43782, 43785, 43790, 43793, 43798, 43808, 43814, 43816, 43822, 43968, 44010, 44012, 44013, 44016, 44025, 44032, 55203, 55216, 55238, 55243, 55291, 63744, 64109, 64112, 64217, 64256, 64262, 64275, 64279, 64285, 64296, 64298, 64310, 64312, 64316, 64318, 64318, 64320, 64321, 64323, 64324, 64326, 64433, 64467, 64829, 64848, 64911, 64914, 64967, 65008, 65019, 65024, 65039, 65056, 65062, 65075, 65076, 65101, 65103, 65136, 65140, 65142, 65276, 65296, 65305, 65313, 65338, 65343, 65343, 65345, 65370, 65382, 65470, 65474, 65479, 65482, 65487, 65490, 65495, 65498, 65500 ];

/**
 * Generated by scripts/regenerate-unicode-identifier-parts.mjs on node v22.1.0 with unicode 15.1
 * based on http://www.unicode.org/reports/tr31/ and https://www.ecma-international.org/ecma-262/6.0/#sec-names-and-keywords
 * unicodeESNextIdentifierStart corresponds to the ID_Start and Other_ID_Start property, and
 * unicodeESNextIdentifierPart corresponds to ID_Continue, Other_ID_Continue, plus ID_Start and Other_ID_Start
 */
// dprint-ignore
const unicodeESNextIdentifierStart = [65, 90, 97, 122, 170, 170, 181, 181, 186, 186, 192, 214, 216, 246, 248, 705, 710, 721, 736, 740, 748, 748, 750, 750, 880, 884, 886, 887, 890, 893, 895, 895, 902, 902, 904, 906, 908, 908, 910, 929, 931, 1013, 1015, 1153, 1162, 1327, 1329, 1366, 1369, 1369, 1376, 1416, 1488, 1514, 1519, 1522, 1568, 1610, 1646, 1647, 1649, 1747, 1749, 1749, 1765, 1766, 1774, 1775, 1786, 1788, 1791, 1791, 1808, 1808, 1810, 1839, 1869, 1957, 1969, 1969, 1994, 2026, 2036, 2037, 2042, 2042, 2048, 2069, 2074, 2074, 2084, 2084, 2088, 2088, 2112, 2136, 2144, 2154, 2160, 2183, 2185, 2190, 2208, 2249, 2308, 2361, 2365, 2365, 2384, 2384, 2392, 2401, 2417, 2432, 2437, 2444, 2447, 2448, 2451, 2472, 2474, 2480, 2482, 2482, 2486, 2489, 2493, 2493, 2510, 2510, 2524, 2525, 2527, 2529, 2544, 2545, 2556, 2556, 2565, 2570, 2575, 2576, 2579, 2600, 2602, 2608, 2610, 2611, 2613, 2614, 2616, 2617, 2649, 2652, 2654, 2654, 2674, 2676, 2693, 2701, 2703, 2705, 2707, 2728, 2730, 2736, 2738, 2739, 2741, 2745, 2749, 2749, 2768, 2768, 2784, 2785, 2809, 2809, 2821, 2828, 2831, 2832, 2835, 2856, 2858, 2864, 2866, 2867, 2869, 2873, 2877, 2877, 2908, 2909, 2911, 2913, 2929, 2929, 2947, 2947, 2949, 2954, 2958, 2960, 2962, 2965, 2969, 2970, 2972, 2972, 2974, 2975, 2979, 2980, 2984, 2986, 2990, 3001, 3024, 3024, 3077, 3084, 3086, 3088, 3090, 3112, 3114, 3129, 3133, 3133, 3160, 3162, 3165, 3165, 3168, 3169, 3200, 3200, 3205, 3212, 3214, 3216, 3218, 3240, 3242, 3251, 3253, 3257, 3261, 3261, 3293, 3294, 3296, 3297, 3313, 3314, 3332, 3340, 3342, 3344, 3346, 3386, 3389, 3389, 3406, 3406, 3412, 3414, 3423, 3425, 3450, 3455, 3461, 3478, 3482, 3505, 3507, 3515, 3517, 3517, 3520, 3526, 3585, 3632, 3634, 3635, 3648, 3654, 3713, 3714, 3716, 3716, 3718, 3722, 3724, 3747, 3749, 3749, 3751, 3760, 3762, 3763, 3773, 3773, 3776, 3780, 3782, 3782, 3804, 3807, 3840, 3840, 3904, 3911, 3913, 3948, 3976, 3980, 4096, 4138, 4159, 4159, 4176, 4181, 4186, 4189, 4193, 4193, 4197, 4198, 4206, 4208, 4213, 4225, 4238, 4238, 4256, 4293, 4295, 4295, 4301, 4301, 4304, 4346, 4348, 4680, 4682, 4685, 4688, 4694, 4696, 4696, 4698, 4701, 4704, 4744, 4746, 4749, 4752, 4784, 4786, 4789, 4792, 4798, 4800, 4800, 4802, 4805, 4808, 4822, 4824, 4880, 4882, 4885, 4888, 4954, 4992, 5007, 5024, 5109, 5112, 5117, 5121, 5740, 5743, 5759, 5761, 5786, 5792, 5866, 5870, 5880, 5888, 5905, 5919, 5937, 5952, 5969, 5984, 5996, 5998, 6000, 6016, 6067, 6103, 6103, 6108, 6108, 6176, 6264, 6272, 6312, 6314, 6314, 6320, 6389, 6400, 6430, 6480, 6509, 6512, 6516, 6528, 6571, 6576, 6601, 6656, 6678, 6688, 6740, 6823, 6823, 6917, 6963, 6981, 6988, 7043, 7072, 7086, 7087, 7098, 7141, 7168, 7203, 7245, 7247, 7258, 7293, 7296, 7304, 7312, 7354, 7357, 7359, 7401, 7404, 7406, 7411, 7413, 7414, 7418, 7418, 7424, 7615, 7680, 7957, 7960, 7965, 7968, 8005, 8008, 8013, 8016, 8023, 8025, 8025, 8027, 8027, 8029, 8029, 8031, 8061, 8064, 8116, 8118, 8124, 8126, 8126, 8130, 8132, 8134, 8140, 8144, 8147, 8150, 8155, 8160, 8172, 8178, 8180, 8182, 8188, 8305, 8305, 8319, 8319, 8336, 8348, 8450, 8450, 8455, 8455, 8458, 8467, 8469, 8469, 8472, 8477, 8484, 8484, 8486, 8486, 8488, 8488, 8490, 8505, 8508, 8511, 8517, 8521, 8526, 8526, 8544, 8584, 11264, 11492, 11499, 11502, 11506, 11507, 11520, 11557, 11559, 11559, 11565, 11565, 11568, 11623, 11631, 11631, 11648, 11670, 11680, 11686, 11688, 11694, 11696, 11702, 11704, 11710, 11712, 11718, 11720, 11726, 11728, 11734, 11736, 11742, 12293, 12295, 12321, 12329, 12337, 12341, 12344, 12348, 12353, 12438, 12443, 12447, 12449, 12538, 12540, 12543, 12549, 12591, 12593, 12686, 12704, 12735, 12784, 12799, 13312, 19903, 19968, 42124, 42192, 42237, 42240, 42508, 42512, 42527, 42538, 42539, 42560, 42606, 42623, 42653, 42656, 42735, 42775, 42783, 42786, 42888, 42891, 42954, 42960, 42961, 42963, 42963, 42965, 42969, 42994, 43009, 43011, 43013, 43015, 43018, 43020, 43042, 43072, 43123, 43138, 43187, 43250, 43255, 43259, 43259, 43261, 43262, 43274, 43301, 43312, 43334, 43360, 43388, 43396, 43442, 43471, 43471, 43488, 43492, 43494, 43503, 43514, 43518, 43520, 43560, 43584, 43586, 43588, 43595, 43616, 43638, 43642, 43642, 43646, 43695, 43697, 43697, 43701, 43702, 43705, 43709, 43712, 43712, 43714, 43714, 43739, 43741, 43744, 43754, 43762, 43764, 43777, 43782, 43785, 43790, 43793, 43798, 43808, 43814, 43816, 43822, 43824, 43866, 43868, 43881, 43888, 44002, 44032, 55203, 55216, 55238, 55243, 55291, 63744, 64109, 64112, 64217, 64256, 64262, 64275, 64279, 64285, 64285, 64287, 64296, 64298, 64310, 64312, 64316, 64318, 64318, 64320, 64321, 64323, 64324, 64326, 64433, 64467, 64829, 64848, 64911, 64914, 64967, 65008, 65019, 65136, 65140, 65142, 65276, 65313, 65338, 65345, 65370, 65382, 65470, 65474, 65479, 65482, 65487, 65490, 65495, 65498, 65500, 65536, 65547, 65549, 65574, 65576, 65594, 65596, 65597, 65599, 65613, 65616, 65629, 65664, 65786, 65856, 65908, 66176, 66204, 66208, 66256, 66304, 66335, 66349, 66378, 66384, 66421, 66432, 66461, 66464, 66499, 66504, 66511, 66513, 66517, 66560, 66717, 66736, 66771, 66776, 66811, 66816, 66855, 66864, 66915, 66928, 66938, 66940, 66954, 66956, 66962, 66964, 66965, 66967, 66977, 66979, 66993, 66995, 67001, 67003, 67004, 67072, 67382, 67392, 67413, 67424, 67431, 67456, 67461, 67463, 67504, 67506, 67514, 67584, 67589, 67592, 67592, 67594, 67637, 67639, 67640, 67644, 67644, 67647, 67669, 67680, 67702, 67712, 67742, 67808, 67826, 67828, 67829, 67840, 67861, 67872, 67897, 67968, 68023, 68030, 68031, 68096, 68096, 68112, 68115, 68117, 68119, 68121, 68149, 68192, 68220, 68224, 68252, 68288, 68295, 68297, 68324, 68352, 68405, 68416, 68437, 68448, 68466, 68480, 68497, 68608, 68680, 68736, 68786, 68800, 68850, 68864, 68899, 69248, 69289, 69296, 69297, 69376, 69404, 69415, 69415, 69424, 69445, 69488, 69505, 69552, 69572, 69600, 69622, 69635, 69687, 69745, 69746, 69749, 69749, 69763, 69807, 69840, 69864, 69891, 69926, 69956, 69956, 69959, 69959, 69968, 70002, 70006, 70006, 70019, 70066, 70081, 70084, 70106, 70106, 70108, 70108, 70144, 70161, 70163, 70187, 70207, 70208, 70272, 70278, 70280, 70280, 70282, 70285, 70287, 70301, 70303, 70312, 70320, 70366, 70405, 70412, 70415, 70416, 70419, 70440, 70442, 70448, 70450, 70451, 70453, 70457, 70461, 70461, 70480, 70480, 70493, 70497, 70656, 70708, 70727, 70730, 70751, 70753, 70784, 70831, 70852, 70853, 70855, 70855, 71040, 71086, 71128, 71131, 71168, 71215, 71236, 71236, 71296, 71338, 71352, 71352, 71424, 71450, 71488, 71494, 71680, 71723, 71840, 71903, 71935, 71942, 71945, 71945, 71948, 71955, 71957, 71958, 71960, 71983, 71999, 71999, 72001, 72001, 72096, 72103, 72106, 72144, 72161, 72161, 72163, 72163, 72192, 72192, 72203, 72242, 72250, 72250, 72272, 72272, 72284, 72329, 72349, 72349, 72368, 72440, 72704, 72712, 72714, 72750, 72768, 72768, 72818, 72847, 72960, 72966, 72968, 72969, 72971, 73008, 73030, 73030, 73056, 73061, 73063, 73064, 73066, 73097, 73112, 73112, 73440, 73458, 73474, 73474, 73476, 73488, 73490, 73523, 73648, 73648, 73728, 74649, 74752, 74862, 74880, 75075, 77712, 77808, 77824, 78895, 78913, 78918, 82944, 83526, 92160, 92728, 92736, 92766, 92784, 92862, 92880, 92909, 92928, 92975, 92992, 92995, 93027, 93047, 93053, 93071, 93760, 93823, 93952, 94026, 94032, 94032, 94099, 94111, 94176, 94177, 94179, 94179, 94208, 100343, 100352, 101589, 101632, 101640, 110576, 110579, 110581, 110587, 110589, 110590, 110592, 110882, 110898, 110898, 110928, 110930, 110933, 110933, 110948, 110951, 110960, 111355, 113664, 113770, 113776, 113788, 113792, 113800, 113808, 113817, 119808, 119892, 119894, 119964, 119966, 119967, 119970, 119970, 119973, 119974, 119977, 119980, 119982, 119993, 119995, 119995, 119997, 120003, 120005, 120069, 120071, 120074, 120077, 120084, 120086, 120092, 120094, 120121, 120123, 120126, 120128, 120132, 120134, 120134, 120138, 120144, 120146, 120485, 120488, 120512, 120514, 120538, 120540, 120570, 120572, 120596, 120598, 120628, 120630, 120654, 120656, 120686, 120688, 120712, 120714, 120744, 120746, 120770, 120772, 120779, 122624, 122654, 122661, 122666, 122928, 122989, 123136, 123180, 123191, 123197, 123214, 123214, 123536, 123565, 123584, 123627, 124112, 124139, 124896, 124902, 124904, 124907, 124909, 124910, 124912, 124926, 124928, 125124, 125184, 125251, 125259, 125259, 126464, 126467, 126469, 126495, 126497, 126498, 126500, 126500, 126503, 126503, 126505, 126514, 126516, 126519, 126521, 126521, 126523, 126523, 126530, 126530, 126535, 126535, 126537, 126537, 126539, 126539, 126541, 126543, 126545, 126546, 126548, 126548, 126551, 126551, 126553, 126553, 126555, 126555, 126557, 126557, 126559, 126559, 126561, 126562, 126564, 126564, 126567, 126570, 126572, 126578, 126580, 126583, 126585, 126588, 126590, 126590, 126592, 126601, 126603, 126619, 126625, 126627, 126629, 126633, 126635, 126651, 131072, 173791, 173824, 177977, 177984, 178205, 178208, 183969, 183984, 191456, 191472, 192093, 194560, 195101, 196608, 201546, 201552, 205743];
// dprint-ignore
const unicodeESNextIdentifierPart = [48, 57, 65, 90, 95, 95, 97, 122, 170, 170, 181, 181, 183, 183, 186, 186, 192, 214, 216, 246, 248, 705, 710, 721, 736, 740, 748, 748, 750, 750, 768, 884, 886, 887, 890, 893, 895, 895, 902, 906, 908, 908, 910, 929, 931, 1013, 1015, 1153, 1155, 1159, 1162, 1327, 1329, 1366, 1369, 1369, 1376, 1416, 1425, 1469, 1471, 1471, 1473, 1474, 1476, 1477, 1479, 1479, 1488, 1514, 1519, 1522, 1552, 1562, 1568, 1641, 1646, 1747, 1749, 1756, 1759, 1768, 1770, 1788, 1791, 1791, 1808, 1866, 1869, 1969, 1984, 2037, 2042, 2042, 2045, 2045, 2048, 2093, 2112, 2139, 2144, 2154, 2160, 2183, 2185, 2190, 2200, 2273, 2275, 2403, 2406, 2415, 2417, 2435, 2437, 2444, 2447, 2448, 2451, 2472, 2474, 2480, 2482, 2482, 2486, 2489, 2492, 2500, 2503, 2504, 2507, 2510, 2519, 2519, 2524, 2525, 2527, 2531, 2534, 2545, 2556, 2556, 2558, 2558, 2561, 2563, 2565, 2570, 2575, 2576, 2579, 2600, 2602, 2608, 2610, 2611, 2613, 2614, 2616, 2617, 2620, 2620, 2622, 2626, 2631, 2632, 2635, 2637, 2641, 2641, 2649, 2652, 2654, 2654, 2662, 2677, 2689, 2691, 2693, 2701, 2703, 2705, 2707, 2728, 2730, 2736, 2738, 2739, 2741, 2745, 2748, 2757, 2759, 2761, 2763, 2765, 2768, 2768, 2784, 2787, 2790, 2799, 2809, 2815, 2817, 2819, 2821, 2828, 2831, 2832, 2835, 2856, 2858, 2864, 2866, 2867, 2869, 2873, 2876, 2884, 2887, 2888, 2891, 2893, 2901, 2903, 2908, 2909, 2911, 2915, 2918, 2927, 2929, 2929, 2946, 2947, 2949, 2954, 2958, 2960, 2962, 2965, 2969, 2970, 2972, 2972, 2974, 2975, 2979, 2980, 2984, 2986, 2990, 3001, 3006, 3010, 3014, 3016, 3018, 3021, 3024, 3024, 3031, 3031, 3046, 3055, 3072, 3084, 3086, 3088, 3090, 3112, 3114, 3129, 3132, 3140, 3142, 3144, 3146, 3149, 3157, 3158, 3160, 3162, 3165, 3165, 3168, 3171, 3174, 3183, 3200, 3203, 3205, 3212, 3214, 3216, 3218, 3240, 3242, 3251, 3253, 3257, 3260, 3268, 3270, 3272, 3274, 3277, 3285, 3286, 3293, 3294, 3296, 3299, 3302, 3311, 3313, 3315, 3328, 3340, 3342, 3344, 3346, 3396, 3398, 3400, 3402, 3406, 3412, 3415, 3423, 3427, 3430, 3439, 3450, 3455, 3457, 3459, 3461, 3478, 3482, 3505, 3507, 3515, 3517, 3517, 3520, 3526, 3530, 3530, 3535, 3540, 3542, 3542, 3544, 3551, 3558, 3567, 3570, 3571, 3585, 3642, 3648, 3662, 3664, 3673, 3713, 3714, 3716, 3716, 3718, 3722, 3724, 3747, 3749, 3749, 3751, 3773, 3776, 3780, 3782, 3782, 3784, 3790, 3792, 3801, 3804, 3807, 3840, 3840, 3864, 3865, 3872, 3881, 3893, 3893, 3895, 3895, 3897, 3897, 3902, 3911, 3913, 3948, 3953, 3972, 3974, 3991, 3993, 4028, 4038, 4038, 4096, 4169, 4176, 4253, 4256, 4293, 4295, 4295, 4301, 4301, 4304, 4346, 4348, 4680, 4682, 4685, 4688, 4694, 4696, 4696, 4698, 4701, 4704, 4744, 4746, 4749, 4752, 4784, 4786, 4789, 4792, 4798, 4800, 4800, 4802, 4805, 4808, 4822, 4824, 4880, 4882, 4885, 4888, 4954, 4957, 4959, 4969, 4977, 4992, 5007, 5024, 5109, 5112, 5117, 5121, 5740, 5743, 5759, 5761, 5786, 5792, 5866, 5870, 5880, 5888, 5909, 5919, 5940, 5952, 5971, 5984, 5996, 5998, 6000, 6002, 6003, 6016, 6099, 6103, 6103, 6108, 6109, 6112, 6121, 6155, 6157, 6159, 6169, 6176, 6264, 6272, 6314, 6320, 6389, 6400, 6430, 6432, 6443, 6448, 6459, 6470, 6509, 6512, 6516, 6528, 6571, 6576, 6601, 6608, 6618, 6656, 6683, 6688, 6750, 6752, 6780, 6783, 6793, 6800, 6809, 6823, 6823, 6832, 6845, 6847, 6862, 6912, 6988, 6992, 7001, 7019, 7027, 7040, 7155, 7168, 7223, 7232, 7241, 7245, 7293, 7296, 7304, 7312, 7354, 7357, 7359, 7376, 7378, 7380, 7418, 7424, 7957, 7960, 7965, 7968, 8005, 8008, 8013, 8016, 8023, 8025, 8025, 8027, 8027, 8029, 8029, 8031, 8061, 8064, 8116, 8118, 8124, 8126, 8126, 8130, 8132, 8134, 8140, 8144, 8147, 8150, 8155, 8160, 8172, 8178, 8180, 8182, 8188, 8204, 8205, 8255, 8256, 8276, 8276, 8305, 8305, 8319, 8319, 8336, 8348, 8400, 8412, 8417, 8417, 8421, 8432, 8450, 8450, 8455, 8455, 8458, 8467, 8469, 8469, 8472, 8477, 8484, 8484, 8486, 8486, 8488, 8488, 8490, 8505, 8508, 8511, 8517, 8521, 8526, 8526, 8544, 8584, 11264, 11492, 11499, 11507, 11520, 11557, 11559, 11559, 11565, 11565, 11568, 11623, 11631, 11631, 11647, 11670, 11680, 11686, 11688, 11694, 11696, 11702, 11704, 11710, 11712, 11718, 11720, 11726, 11728, 11734, 11736, 11742, 11744, 11775, 12293, 12295, 12321, 12335, 12337, 12341, 12344, 12348, 12353, 12438, 12441, 12447, 12449, 12543, 12549, 12591, 12593, 12686, 12704, 12735, 12784, 12799, 13312, 19903, 19968, 42124, 42192, 42237, 42240, 42508, 42512, 42539, 42560, 42607, 42612, 42621, 42623, 42737, 42775, 42783, 42786, 42888, 42891, 42954, 42960, 42961, 42963, 42963, 42965, 42969, 42994, 43047, 43052, 43052, 43072, 43123, 43136, 43205, 43216, 43225, 43232, 43255, 43259, 43259, 43261, 43309, 43312, 43347, 43360, 43388, 43392, 43456, 43471, 43481, 43488, 43518, 43520, 43574, 43584, 43597, 43600, 43609, 43616, 43638, 43642, 43714, 43739, 43741, 43744, 43759, 43762, 43766, 43777, 43782, 43785, 43790, 43793, 43798, 43808, 43814, 43816, 43822, 43824, 43866, 43868, 43881, 43888, 44010, 44012, 44013, 44016, 44025, 44032, 55203, 55216, 55238, 55243, 55291, 63744, 64109, 64112, 64217, 64256, 64262, 64275, 64279, 64285, 64296, 64298, 64310, 64312, 64316, 64318, 64318, 64320, 64321, 64323, 64324, 64326, 64433, 64467, 64829, 64848, 64911, 64914, 64967, 65008, 65019, 65024, 65039, 65056, 65071, 65075, 65076, 65101, 65103, 65136, 65140, 65142, 65276, 65296, 65305, 65313, 65338, 65343, 65343, 65345, 65370, 65381, 65470, 65474, 65479, 65482, 65487, 65490, 65495, 65498, 65500, 65536, 65547, 65549, 65574, 65576, 65594, 65596, 65597, 65599, 65613, 65616, 65629, 65664, 65786, 65856, 65908, 66045, 66045, 66176, 66204, 66208, 66256, 66272, 66272, 66304, 66335, 66349, 66378, 66384, 66426, 66432, 66461, 66464, 66499, 66504, 66511, 66513, 66517, 66560, 66717, 66720, 66729, 66736, 66771, 66776, 66811, 66816, 66855, 66864, 66915, 66928, 66938, 66940, 66954, 66956, 66962, 66964, 66965, 66967, 66977, 66979, 66993, 66995, 67001, 67003, 67004, 67072, 67382, 67392, 67413, 67424, 67431, 67456, 67461, 67463, 67504, 67506, 67514, 67584, 67589, 67592, 67592, 67594, 67637, 67639, 67640, 67644, 67644, 67647, 67669, 67680, 67702, 67712, 67742, 67808, 67826, 67828, 67829, 67840, 67861, 67872, 67897, 67968, 68023, 68030, 68031, 68096, 68099, 68101, 68102, 68108, 68115, 68117, 68119, 68121, 68149, 68152, 68154, 68159, 68159, 68192, 68220, 68224, 68252, 68288, 68295, 68297, 68326, 68352, 68405, 68416, 68437, 68448, 68466, 68480, 68497, 68608, 68680, 68736, 68786, 68800, 68850, 68864, 68903, 68912, 68921, 69248, 69289, 69291, 69292, 69296, 69297, 69373, 69404, 69415, 69415, 69424, 69456, 69488, 69509, 69552, 69572, 69600, 69622, 69632, 69702, 69734, 69749, 69759, 69818, 69826, 69826, 69840, 69864, 69872, 69881, 69888, 69940, 69942, 69951, 69956, 69959, 69968, 70003, 70006, 70006, 70016, 70084, 70089, 70092, 70094, 70106, 70108, 70108, 70144, 70161, 70163, 70199, 70206, 70209, 70272, 70278, 70280, 70280, 70282, 70285, 70287, 70301, 70303, 70312, 70320, 70378, 70384, 70393, 70400, 70403, 70405, 70412, 70415, 70416, 70419, 70440, 70442, 70448, 70450, 70451, 70453, 70457, 70459, 70468, 70471, 70472, 70475, 70477, 70480, 70480, 70487, 70487, 70493, 70499, 70502, 70508, 70512, 70516, 70656, 70730, 70736, 70745, 70750, 70753, 70784, 70853, 70855, 70855, 70864, 70873, 71040, 71093, 71096, 71104, 71128, 71133, 71168, 71232, 71236, 71236, 71248, 71257, 71296, 71352, 71360, 71369, 71424, 71450, 71453, 71467, 71472, 71481, 71488, 71494, 71680, 71738, 71840, 71913, 71935, 71942, 71945, 71945, 71948, 71955, 71957, 71958, 71960, 71989, 71991, 71992, 71995, 72003, 72016, 72025, 72096, 72103, 72106, 72151, 72154, 72161, 72163, 72164, 72192, 72254, 72263, 72263, 72272, 72345, 72349, 72349, 72368, 72440, 72704, 72712, 72714, 72758, 72760, 72768, 72784, 72793, 72818, 72847, 72850, 72871, 72873, 72886, 72960, 72966, 72968, 72969, 72971, 73014, 73018, 73018, 73020, 73021, 73023, 73031, 73040, 73049, 73056, 73061, 73063, 73064, 73066, 73102, 73104, 73105, 73107, 73112, 73120, 73129, 73440, 73462, 73472, 73488, 73490, 73530, 73534, 73538, 73552, 73561, 73648, 73648, 73728, 74649, 74752, 74862, 74880, 75075, 77712, 77808, 77824, 78895, 78912, 78933, 82944, 83526, 92160, 92728, 92736, 92766, 92768, 92777, 92784, 92862, 92864, 92873, 92880, 92909, 92912, 92916, 92928, 92982, 92992, 92995, 93008, 93017, 93027, 93047, 93053, 93071, 93760, 93823, 93952, 94026, 94031, 94087, 94095, 94111, 94176, 94177, 94179, 94180, 94192, 94193, 94208, 100343, 100352, 101589, 101632, 101640, 110576, 110579, 110581, 110587, 110589, 110590, 110592, 110882, 110898, 110898, 110928, 110930, 110933, 110933, 110948, 110951, 110960, 111355, 113664, 113770, 113776, 113788, 113792, 113800, 113808, 113817, 113821, 113822, 118528, 118573, 118576, 118598, 119141, 119145, 119149, 119154, 119163, 119170, 119173, 119179, 119210, 119213, 119362, 119364, 119808, 119892, 119894, 119964, 119966, 119967, 119970, 119970, 119973, 119974, 119977, 119980, 119982, 119993, 119995, 119995, 119997, 120003, 120005, 120069, 120071, 120074, 120077, 120084, 120086, 120092, 120094, 120121, 120123, 120126, 120128, 120132, 120134, 120134, 120138, 120144, 120146, 120485, 120488, 120512, 120514, 120538, 120540, 120570, 120572, 120596, 120598, 120628, 120630, 120654, 120656, 120686, 120688, 120712, 120714, 120744, 120746, 120770, 120772, 120779, 120782, 120831, 121344, 121398, 121403, 121452, 121461, 121461, 121476, 121476, 121499, 121503, 121505, 121519, 122624, 122654, 122661, 122666, 122880, 122886, 122888, 122904, 122907, 122913, 122915, 122916, 122918, 122922, 122928, 122989, 123023, 123023, 123136, 123180, 123184, 123197, 123200, 123209, 123214, 123214, 123536, 123566, 123584, 123641, 124112, 124153, 124896, 124902, 124904, 124907, 124909, 124910, 124912, 124926, 124928, 125124, 125136, 125142, 125184, 125259, 125264, 125273, 126464, 126467, 126469, 126495, 126497, 126498, 126500, 126500, 126503, 126503, 126505, 126514, 126516, 126519, 126521, 126521, 126523, 126523, 126530, 126530, 126535, 126535, 126537, 126537, 126539, 126539, 126541, 126543, 126545, 126546, 126548, 126548, 126551, 126551, 126553, 126553, 126555, 126555, 126557, 126557, 126559, 126559, 126561, 126562, 126564, 126564, 126567, 126570, 126572, 126578, 126580, 126583, 126585, 126588, 126590, 126590, 126592, 126601, 126603, 126619, 126625, 126627, 126629, 126633, 126635, 126651, 130032, 130041, 131072, 173791, 173824, 177977, 177984, 178205, 178208, 183969, 183984, 191456, 191472, 192093, 194560, 195101, 196608, 201546, 201552, 205743, 917760, 917999];

/**
 * Test for whether a single line comment with leading whitespace trimmed's text contains a directive.
 */
const commentDirectiveRegExSingleLine = /^\/\/\/?\s*@(ts-expect-error|ts-ignore)/;

/**
 * Test for whether a multi-line comment with leading whitespace trimmed's last line contains a directive.
 */
const commentDirectiveRegExMultiLine = /^(?:\/|\*)*\s*@(ts-expect-error|ts-ignore)/;

const jsDocSeeOrLink = /@(?:see|link)/i;

function lookupInUnicodeMap(code: number, map: readonly number[]): boolean {
    // Bail out quickly if it couldn't possibly be in the map.
    if (code < map[0]) {
        return false;
    }

    // Perform binary search in one of the Unicode range maps
    let lo = 0;
    let hi: number = map.length;
    let mid: number;

    while (lo + 1 < hi) {
        mid = lo + (hi - lo) / 2;
        // mid has to be even to catch a range's beginning
        mid -= mid % 2;
        if (map[mid] <= code && code <= map[mid + 1]) {
            return true;
        }

        if (code < map[mid]) {
            hi = mid;
        }
        else {
            lo = mid + 2;
        }
    }

    return false;
}

/** @internal */
export function isUnicodeIdentifierStart(code: number, languageVersion: ScriptTarget | undefined) {
    return languageVersion! >= ScriptTarget.ES2015 ?
        lookupInUnicodeMap(code, unicodeESNextIdentifierStart) :
        lookupInUnicodeMap(code, unicodeES5IdentifierStart);
}

function isUnicodeIdentifierPart(code: number, languageVersion: ScriptTarget | undefined) {
    return languageVersion! >= ScriptTarget.ES2015 ?
        lookupInUnicodeMap(code, unicodeESNextIdentifierPart) :
        lookupInUnicodeMap(code, unicodeES5IdentifierPart);
}

function makeReverseMap<T>(source: Map<T, number>): T[] {
    const result: T[] = [];
    source.forEach((value, name) => {
        result[value] = name;
    });
    return result;
}

const tokenStrings = makeReverseMap(textToToken);

/** @internal */
export function tokenToString(t: PunctuationOrKeywordSyntaxKind): string;
export function tokenToString(t: SyntaxKind): string | undefined;
export function tokenToString(t: SyntaxKind): string | undefined {
    return tokenStrings[t];
}

/** @internal */
export function stringToToken(s: string): SyntaxKind | undefined {
    return textToToken.get(s);
}

const regExpFlagCharCodes = makeReverseMap(charCodeToRegExpFlag);

/** @internal @knipignore */
export function regularExpressionFlagToCharacterCode(f: RegularExpressionFlags): CharacterCodes | undefined {
    return regExpFlagCharCodes[f];
}

/** @internal @knipignore */
export function characterCodeToRegularExpressionFlag(ch: CharacterCodes): RegularExpressionFlags | undefined {
    return charCodeToRegExpFlag.get(ch);
}

/** @internal */
export function computeLineStarts(text: string): number[] {
    const result: number[] = [];
    let pos = 0;
    let lineStart = 0;
    while (pos < text.length) {
        const ch = text.charCodeAt(pos);
        pos++;
        switch (ch) {
            case CharacterCodes.carriageReturn:
                if (text.charCodeAt(pos) === CharacterCodes.lineFeed) {
                    pos++;
                }
            // falls through
            case CharacterCodes.lineFeed:
                result.push(lineStart);
                lineStart = pos;
                break;
            default:
                if (ch > CharacterCodes.maxAsciiCharacter && isLineBreak(ch)) {
                    result.push(lineStart);
                    lineStart = pos;
                }
                break;
        }
    }
    result.push(lineStart);
    return result;
}

export function getPositionOfLineAndCharacter(sourceFile: SourceFileLike, line: number, character: number): number;
/** @internal */
export function getPositionOfLineAndCharacter(sourceFile: SourceFileLike, line: number, character: number, allowEdits?: true): number; // eslint-disable-line @typescript-eslint/unified-signatures
export function getPositionOfLineAndCharacter(sourceFile: SourceFileLike, line: number, character: number, allowEdits?: true): number {
    return sourceFile.getPositionOfLineAndCharacter ?
        sourceFile.getPositionOfLineAndCharacter(line, character, allowEdits) :
        computePositionOfLineAndCharacter(getLineStarts(sourceFile), line, character, sourceFile.text, allowEdits);
}

/** @internal */
export function computePositionOfLineAndCharacter(lineStarts: readonly number[], line: number, character: number, debugText?: string, allowEdits?: true): number {
    if (line < 0 || line >= lineStarts.length) {
        if (allowEdits) {
            // Clamp line to nearest allowable value
            line = line < 0 ? 0 : line >= lineStarts.length ? lineStarts.length - 1 : line;
        }
        else {
            Debug.fail(`Bad line number. Line: ${line}, lineStarts.length: ${lineStarts.length} , line map is correct? ${debugText !== undefined ? arrayIsEqualTo(lineStarts, computeLineStarts(debugText)) : "unknown"}`);
        }
    }

    const res = lineStarts[line] + character;
    if (allowEdits) {
        // Clamp to nearest allowable values to allow the underlying to be edited without crashing (accuracy is lost, instead)
        // TODO: Somehow track edits between file as it was during the creation of sourcemap we have and the current file and
        // apply them to the computed position to improve accuracy
        return res > lineStarts[line + 1] ? lineStarts[line + 1] : typeof debugText === "string" && res > debugText.length ? debugText.length : res;
    }
    if (line < lineStarts.length - 1) {
        Debug.assert(res < lineStarts[line + 1]);
    }
    else if (debugText !== undefined) {
        Debug.assert(res <= debugText.length); // Allow single character overflow for trailing newline
    }
    return res;
}

/** @internal */
export function getLineStarts(sourceFile: SourceFileLike): readonly number[] {
    return sourceFile.lineMap || (sourceFile.lineMap = computeLineStarts(sourceFile.text));
}

/** @internal */
export function computeLineAndCharacterOfPosition(lineStarts: readonly number[], position: number): LineAndCharacter {
    const lineNumber = computeLineOfPosition(lineStarts, position);
    return {
        line: lineNumber,
        character: position - lineStarts[lineNumber],
    };
}

/**
 * @internal
 * We assume the first line starts at position 0 and 'position' is non-negative.
 */
export function computeLineOfPosition(lineStarts: readonly number[], position: number, lowerBound?: number) {
    let lineNumber = binarySearch(lineStarts, position, identity, compareValues, lowerBound);
    if (lineNumber < 0) {
        // If the actual position was not found,
        // the binary search returns the 2's-complement of the next line start
        // e.g. if the line starts at [5, 10, 23, 80] and the position requested was 20
        // then the search will return -2.
        //
        // We want the index of the previous line start, so we subtract 1.
        // Review 2's-complement if this is confusing.
        lineNumber = ~lineNumber - 1;
        Debug.assert(lineNumber !== -1, "position cannot precede the beginning of the file");
    }
    return lineNumber;
}

/** @internal */
export function getLinesBetweenPositions(sourceFile: SourceFileLike, pos1: number, pos2: number) {
    if (pos1 === pos2) return 0;
    const lineStarts = getLineStarts(sourceFile);
    const lower = Math.min(pos1, pos2);
    const isNegative = lower === pos2;
    const upper = isNegative ? pos1 : pos2;
    const lowerLine = computeLineOfPosition(lineStarts, lower);
    const upperLine = computeLineOfPosition(lineStarts, upper, lowerLine);
    return isNegative ? lowerLine - upperLine : upperLine - lowerLine;
}

export function getLineAndCharacterOfPosition(sourceFile: SourceFileLike, position: number): LineAndCharacter {
    return computeLineAndCharacterOfPosition(getLineStarts(sourceFile), position);
}

export function isWhiteSpaceLike(ch: number): boolean {
    return isWhiteSpaceSingleLine(ch) || isLineBreak(ch);
}

/** Does not include line breaks. For that, see isWhiteSpaceLike. */
export function isWhiteSpaceSingleLine(ch: number): boolean {
    // Note: nextLine is in the Zs space, and should be considered to be a whitespace.
    // It is explicitly not a line-break as it isn't in the exact set specified by EcmaScript.
    return ch === CharacterCodes.space ||
        ch === CharacterCodes.tab ||
        ch === CharacterCodes.verticalTab ||
        ch === CharacterCodes.formFeed ||
        ch === CharacterCodes.nonBreakingSpace ||
        ch === CharacterCodes.nextLine ||
        ch === CharacterCodes.ogham ||
        ch >= CharacterCodes.enQuad && ch <= CharacterCodes.zeroWidthSpace ||
        ch === CharacterCodes.narrowNoBreakSpace ||
        ch === CharacterCodes.mathematicalSpace ||
        ch === CharacterCodes.ideographicSpace ||
        ch === CharacterCodes.byteOrderMark;
}

export function isLineBreak(ch: number): boolean {
    // ES5 7.3:
    // The ECMAScript line terminator characters are listed in Table 3.
    //     Table 3: Line Terminator Characters
    //     Code Unit Value     Name                    Formal Name
    //     \u000A              Line Feed               <LF>
    //     \u000D              Carriage Return         <CR>
    //     \u2028              Line separator          <LS>
    //     \u2029              Paragraph separator     <PS>
    // Only the characters in Table 3 are treated as line terminators. Other new line or line
    // breaking characters are treated as white space but not as line terminators.

    return ch === CharacterCodes.lineFeed ||
        ch === CharacterCodes.carriageReturn ||
        ch === CharacterCodes.lineSeparator ||
        ch === CharacterCodes.paragraphSeparator;
}

function isDigit(ch: number): boolean {
    return ch >= CharacterCodes._0 && ch <= CharacterCodes._9;
}

function isHexDigit(ch: number): boolean {
    return isDigit(ch) || ch >= CharacterCodes.A && ch <= CharacterCodes.F || ch >= CharacterCodes.a && ch <= CharacterCodes.f;
}

function isASCIILetter(ch: number): boolean {
    return ch >= CharacterCodes.A && ch <= CharacterCodes.Z || ch >= CharacterCodes.a && ch <= CharacterCodes.z;
}

// Section 6.1.4
function isWordCharacter(ch: number): boolean {
    return isASCIILetter(ch) || isDigit(ch) || ch === CharacterCodes._;
}

function isOctalDigit(ch: number): boolean {
    return ch >= CharacterCodes._0 && ch <= CharacterCodes._7;
}

export function couldStartTrivia(text: string, pos: number): boolean {
    // Keep in sync with skipTrivia
    const ch = text.charCodeAt(pos);
    switch (ch) {
        case CharacterCodes.carriageReturn:
        case CharacterCodes.lineFeed:
        case CharacterCodes.tab:
        case CharacterCodes.verticalTab:
        case CharacterCodes.formFeed:
        case CharacterCodes.space:
        case CharacterCodes.slash:
        // starts of normal trivia
        // falls through
        case CharacterCodes.lessThan:
        case CharacterCodes.bar:
        case CharacterCodes.equals:
        case CharacterCodes.greaterThan:
            // Starts of conflict marker trivia
            return true;
        case CharacterCodes.hash:
            // Only if its the beginning can we have #! trivia
            return pos === 0;
        default:
            return ch > CharacterCodes.maxAsciiCharacter;
    }
}

/** @internal */
export function skipTrivia(text: string, pos: number, stopAfterLineBreak?: boolean, stopAtComments?: boolean, inJSDoc?: boolean): number {
    if (positionIsSynthesized(pos)) {
        return pos;
    }

    let canConsumeStar = false;
    // Keep in sync with couldStartTrivia
    while (true) {
        const ch = text.charCodeAt(pos);
        switch (ch) {
            case CharacterCodes.carriageReturn:
                if (text.charCodeAt(pos + 1) === CharacterCodes.lineFeed) {
                    pos++;
                }
            // falls through
            case CharacterCodes.lineFeed:
                pos++;
                if (stopAfterLineBreak) {
                    return pos;
                }
                canConsumeStar = !!inJSDoc;
                continue;
            case CharacterCodes.tab:
            case CharacterCodes.verticalTab:
            case CharacterCodes.formFeed:
            case CharacterCodes.space:
                pos++;
                continue;
            case CharacterCodes.slash:
                if (stopAtComments) {
                    break;
                }
                if (text.charCodeAt(pos + 1) === CharacterCodes.slash) {
                    pos += 2;
                    while (pos < text.length) {
                        if (isLineBreak(text.charCodeAt(pos))) {
                            break;
                        }
                        pos++;
                    }
                    canConsumeStar = false;
                    continue;
                }
                if (text.charCodeAt(pos + 1) === CharacterCodes.asterisk) {
                    pos += 2;
                    while (pos < text.length) {
                        if (text.charCodeAt(pos) === CharacterCodes.asterisk && text.charCodeAt(pos + 1) === CharacterCodes.slash) {
                            pos += 2;
                            break;
                        }
                        pos++;
                    }
                    canConsumeStar = false;
                    continue;
                }
                break;

            case CharacterCodes.lessThan:
            case CharacterCodes.bar:
            case CharacterCodes.equals:
            case CharacterCodes.greaterThan:
                if (isConflictMarkerTrivia(text, pos)) {
                    pos = scanConflictMarkerTrivia(text, pos);
                    canConsumeStar = false;
                    continue;
                }
                break;

            case CharacterCodes.hash:
                if (pos === 0 && isShebangTrivia(text, pos)) {
                    pos = scanShebangTrivia(text, pos);
                    canConsumeStar = false;
                    continue;
                }
                break;

            case CharacterCodes.asterisk:
                if (canConsumeStar) {
                    pos++;
                    canConsumeStar = false;
                    continue;
                }
                break;

            default:
                if (ch > CharacterCodes.maxAsciiCharacter && (isWhiteSpaceLike(ch))) {
                    pos++;
                    continue;
                }
                break;
        }
        return pos;
    }
}

// All conflict markers consist of the same character repeated seven times.  If it is
// a <<<<<<< or >>>>>>> marker then it is also followed by a space.
const mergeConflictMarkerLength = "<<<<<<<".length;

function isConflictMarkerTrivia(text: string, pos: number) {
    Debug.assert(pos >= 0);

    // Conflict markers must be at the start of a line.
    if (pos === 0 || isLineBreak(text.charCodeAt(pos - 1))) {
        const ch = text.charCodeAt(pos);

        if ((pos + mergeConflictMarkerLength) < text.length) {
            for (let i = 0; i < mergeConflictMarkerLength; i++) {
                if (text.charCodeAt(pos + i) !== ch) {
                    return false;
                }
            }

            return ch === CharacterCodes.equals ||
                text.charCodeAt(pos + mergeConflictMarkerLength) === CharacterCodes.space;
        }
    }

    return false;
}

function scanConflictMarkerTrivia(text: string, pos: number, error?: (diag: DiagnosticMessage, pos?: number, len?: number) => void) {
    if (error) {
        error(Diagnostics.Merge_conflict_marker_encountered, pos, mergeConflictMarkerLength);
    }

    const ch = text.charCodeAt(pos);
    const len = text.length;

    if (ch === CharacterCodes.lessThan || ch === CharacterCodes.greaterThan) {
        while (pos < len && !isLineBreak(text.charCodeAt(pos))) {
            pos++;
        }
    }
    else {
        Debug.assert(ch === CharacterCodes.bar || ch === CharacterCodes.equals);
        // Consume everything from the start of a ||||||| or ======= marker to the start
        // of the next ======= or >>>>>>> marker.
        while (pos < len) {
            const currentChar = text.charCodeAt(pos);
            if ((currentChar === CharacterCodes.equals || currentChar === CharacterCodes.greaterThan) && currentChar !== ch && isConflictMarkerTrivia(text, pos)) {
                break;
            }

            pos++;
        }
    }

    return pos;
}

const shebangTriviaRegex = /^#!.*/;

function isShebangTrivia(text: string, pos: number) {
    // Shebangs check must only be done at the start of the file
    Debug.assert(pos === 0);
    return shebangTriviaRegex.test(text);
}

function scanShebangTrivia(text: string, pos: number) {
    const shebang = shebangTriviaRegex.exec(text)![0];
    pos = pos + shebang.length;
    return pos;
}

/**
 * Invokes a callback for each comment range following the provided position.
 *
 * Single-line comment ranges include the leading double-slash characters but not the ending
 * line break. Multi-line comment ranges include the leading slash-asterisk and trailing
 * asterisk-slash characters.
 *
 * @param reduce If true, accumulates the result of calling the callback in a fashion similar
 *      to reduceLeft. If false, iteration stops when the callback returns a truthy value.
 * @param text The source text to scan.
 * @param pos The position at which to start scanning.
 * @param trailing If false, whitespace is skipped until the first line break and comments
 *      between that location and the next token are returned. If true, comments occurring
 *      between the given position and the next line break are returned.
 * @param cb The callback to execute as each comment range is encountered.
 * @param state A state value to pass to each iteration of the callback.
 * @param initial An initial value to pass when accumulating results (when "reduce" is true).
 * @returns If "reduce" is true, the accumulated value. If "reduce" is false, the first truthy
 *      return value of the callback.
 */
function iterateCommentRanges<T, U>(reduce: boolean, text: string, pos: number, trailing: boolean, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean, state: T, memo: U | undefined) => U, state: T, initial?: U): U | undefined {
    let pendingPos!: number;
    let pendingEnd!: number;
    let pendingKind!: CommentKind;
    let pendingHasTrailingNewLine!: boolean;
    let hasPendingCommentRange = false;
    let collecting = trailing;
    let accumulator = initial;
    if (pos === 0) {
        collecting = true;
        const shebang = getShebang(text);
        if (shebang) {
            pos = shebang.length;
        }
    }
    scan:
    while (pos >= 0 && pos < text.length) {
        const ch = text.charCodeAt(pos);
        switch (ch) {
            case CharacterCodes.carriageReturn:
                if (text.charCodeAt(pos + 1) === CharacterCodes.lineFeed) {
                    pos++;
                }
            // falls through
            case CharacterCodes.lineFeed:
                pos++;
                if (trailing) {
                    break scan;
                }

                collecting = true;
                if (hasPendingCommentRange) {
                    pendingHasTrailingNewLine = true;
                }

                continue;
            case CharacterCodes.tab:
            case CharacterCodes.verticalTab:
            case CharacterCodes.formFeed:
            case CharacterCodes.space:
                pos++;
                continue;
            case CharacterCodes.slash:
                const nextChar = text.charCodeAt(pos + 1);
                let hasTrailingNewLine = false;
                if (nextChar === CharacterCodes.slash || nextChar === CharacterCodes.asterisk) {
                    const kind = nextChar === CharacterCodes.slash ? SyntaxKind.SingleLineCommentTrivia : SyntaxKind.MultiLineCommentTrivia;
                    const startPos = pos;
                    pos += 2;
                    if (nextChar === CharacterCodes.slash) {
                        while (pos < text.length) {
                            if (isLineBreak(text.charCodeAt(pos))) {
                                hasTrailingNewLine = true;
                                break;
                            }
                            pos++;
                        }
                    }
                    else {
                        while (pos < text.length) {
                            if (text.charCodeAt(pos) === CharacterCodes.asterisk && text.charCodeAt(pos + 1) === CharacterCodes.slash) {
                                pos += 2;
                                break;
                            }
                            pos++;
                        }
                    }

                    if (collecting) {
                        if (hasPendingCommentRange) {
                            accumulator = cb(pendingPos, pendingEnd, pendingKind, pendingHasTrailingNewLine, state, accumulator);
                            if (!reduce && accumulator) {
                                // If we are not reducing and we have a truthy result, return it.
                                return accumulator;
                            }
                        }

                        pendingPos = startPos;
                        pendingEnd = pos;
                        pendingKind = kind;
                        pendingHasTrailingNewLine = hasTrailingNewLine;
                        hasPendingCommentRange = true;
                    }

                    continue;
                }
                break scan;
            default:
                if (ch > CharacterCodes.maxAsciiCharacter && (isWhiteSpaceLike(ch))) {
                    if (hasPendingCommentRange && isLineBreak(ch)) {
                        pendingHasTrailingNewLine = true;
                    }
                    pos++;
                    continue;
                }
                break scan;
        }
    }

    if (hasPendingCommentRange) {
        accumulator = cb(pendingPos, pendingEnd, pendingKind, pendingHasTrailingNewLine, state, accumulator);
    }

    return accumulator;
}

export function forEachLeadingCommentRange<U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean) => U): U | undefined;
export function forEachLeadingCommentRange<T, U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean, state: T) => U, state: T): U | undefined;
export function forEachLeadingCommentRange<T, U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean, state: T) => U, state?: T): U | undefined {
    return iterateCommentRanges(/*reduce*/ false, text, pos, /*trailing*/ false, cb, state!);
}

export function forEachTrailingCommentRange<U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean) => U): U | undefined;
export function forEachTrailingCommentRange<T, U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean, state: T) => U, state: T): U | undefined;
export function forEachTrailingCommentRange<T, U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean, state: T) => U, state?: T): U | undefined {
    return iterateCommentRanges(/*reduce*/ false, text, pos, /*trailing*/ true, cb, state!);
}

export function reduceEachLeadingCommentRange<T, U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean, state: T) => U, state: T, initial: U) {
    return iterateCommentRanges(/*reduce*/ true, text, pos, /*trailing*/ false, cb, state, initial);
}

export function reduceEachTrailingCommentRange<T, U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean, state: T) => U, state: T, initial: U) {
    return iterateCommentRanges(/*reduce*/ true, text, pos, /*trailing*/ true, cb, state, initial);
}

function appendCommentRange(pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean, _state: any, comments: CommentRange[] = []) {
    comments.push({ kind, pos, end, hasTrailingNewLine });
    return comments;
}

export function getLeadingCommentRanges(text: string, pos: number): CommentRange[] | undefined {
    return reduceEachLeadingCommentRange(text, pos, appendCommentRange, /*state*/ undefined, /*initial*/ undefined);
}

export function getTrailingCommentRanges(text: string, pos: number): CommentRange[] | undefined {
    return reduceEachTrailingCommentRange(text, pos, appendCommentRange, /*state*/ undefined, /*initial*/ undefined);
}

/** Optionally, get the shebang */
export function getShebang(text: string): string | undefined {
    const match = shebangTriviaRegex.exec(text);
    if (match) {
        return match[0];
    }
}

export function isIdentifierStart(ch: number, languageVersion: ScriptTarget | undefined): boolean {
    return isASCIILetter(ch) || ch === CharacterCodes.$ || ch === CharacterCodes._ ||
        ch > CharacterCodes.maxAsciiCharacter && isUnicodeIdentifierStart(ch, languageVersion);
}

export function isIdentifierPart(ch: number, languageVersion: ScriptTarget | undefined, identifierVariant?: LanguageVariant): boolean {
    return isWordCharacter(ch) || ch === CharacterCodes.$ ||
        // "-" and ":" are valid in JSX Identifiers
        (identifierVariant === LanguageVariant.JSX ? (ch === CharacterCodes.minus || ch === CharacterCodes.colon) : false) ||
        ch > CharacterCodes.maxAsciiCharacter && isUnicodeIdentifierPart(ch, languageVersion);
}

/** @internal */
export function isIdentifierText(name: string, languageVersion: ScriptTarget | undefined, identifierVariant?: LanguageVariant): boolean {
    let ch = codePointAt(name, 0);
    if (!isIdentifierStart(ch, languageVersion)) {
        return false;
    }

    for (let i = charSize(ch); i < name.length; i += charSize(ch)) {
        if (!isIdentifierPart(ch = codePointAt(name, i), languageVersion, identifierVariant)) {
            return false;
        }
    }

    return true;
}

const enum EscapeSequenceScanningFlags {
    String = 1 << 0,
    ReportErrors = 1 << 1,

    RegularExpression = 1 << 2,
    AnnexB = 1 << 3,
    AnyUnicodeMode = 1 << 4,
    AtomEscape = 1 << 5,

    ReportInvalidEscapeErrors = RegularExpression | ReportErrors,
    ScanExtendedUnicodeEscape = String | AnyUnicodeMode,
}

const enum ClassSetExpressionType {
    Unknown,
    ClassUnion,
    ClassIntersection,
    ClassSubtraction,
}

// Creates a scanner over a (possibly unspecified) range of a piece of text.
export function createScanner(languageVersion: ScriptTarget, skipTrivia: boolean, languageVariant = LanguageVariant.Standard, textInitial?: string, onError?: ErrorCallback, start?: number, length?: number): Scanner {
    // Why var? It avoids TDZ checks in the runtime which can be costly.
    // See: https://github.com/microsoft/TypeScript/issues/52924
    /* eslint-disable no-var */
    var text = textInitial!;

    // Current position (end position of text of current token)
    var pos: number;

    // end of text
    var end: number;

    // Start position of whitespace before current token
    var fullStartPos: number;

    // Start position of text of current token
    var tokenStart: number;

    var token: SyntaxKind;
    var tokenValue!: string;
    var tokenFlags: TokenFlags;

    var commentDirectives: CommentDirective[] | undefined;
    var skipJsDocLeadingAsterisks = 0;

    var scriptKind = ScriptKind.Unknown;
    var jsDocParsingMode = JSDocParsingMode.ParseAll;

    setText(text, start, length);

    var scanner: Scanner = {
        getTokenFullStart: () => fullStartPos,
        getStartPos: () => fullStartPos,
        getTokenEnd: () => pos,
        getTextPos: () => pos,
        getToken: () => token,
        getTokenStart: () => tokenStart,
        getTokenPos: () => tokenStart,
        getTokenText: () => text.substring(tokenStart, pos),
        getTokenValue: () => tokenValue,
        hasUnicodeEscape: () => (tokenFlags & TokenFlags.UnicodeEscape) !== 0,
        hasExtendedUnicodeEscape: () => (tokenFlags & TokenFlags.ExtendedUnicodeEscape) !== 0,
        hasPrecedingLineBreak: () => (tokenFlags & TokenFlags.PrecedingLineBreak) !== 0,
        hasPrecedingJSDocComment: () => (tokenFlags & TokenFlags.PrecedingJSDocComment) !== 0,
        isIdentifier: () => token === SyntaxKind.Identifier || token > SyntaxKind.LastReservedWord,
        isReservedWord: () => token >= SyntaxKind.FirstReservedWord && token <= SyntaxKind.LastReservedWord,
        isUnterminated: () => (tokenFlags & TokenFlags.Unterminated) !== 0,
        getCommentDirectives: () => commentDirectives,
        getNumericLiteralFlags: () => tokenFlags & TokenFlags.NumericLiteralFlags,
        getTokenFlags: () => tokenFlags,
        reScanGreaterToken,
        reScanAsteriskEqualsToken,
        reScanSlashToken,
        reScanTemplateToken,
        reScanTemplateHeadOrNoSubstitutionTemplate,
        scanJsxIdentifier,
        scanJsxAttributeValue,
        reScanJsxAttributeValue,
        reScanJsxToken,
        reScanLessThanToken,
        reScanHashToken,
        reScanQuestionToken,
        reScanInvalidIdentifier,
        scanJsxToken,
        scanJsDocToken,
        scanJSDocCommentTextToken,
        scan,
        getText,
        clearCommentDirectives,
        setText,
        setScriptTarget,
        setLanguageVariant,
        setScriptKind,
        setJSDocParsingMode,
        setOnError,
        resetTokenState,
        setTextPos: resetTokenState,
        setSkipJsDocLeadingAsterisks,
        tryScan,
        lookAhead,
        scanRange,
    };
    /* eslint-enable no-var */

    if (Debug.isDebugging) {
        Object.defineProperty(scanner, "__debugShowCurrentPositionInText", {
            get: () => {
                const text = scanner.getText();
                return text.slice(0, scanner.getTokenFullStart()) + "║" + text.slice(scanner.getTokenFullStart());
            },
        });
    }

    return scanner;

    /**
     * Returns the code point for the character at the given position within `text`. This
     * should only be used when pos is guaranteed to be within the bounds of `text` as this
     * function does not perform bounds checks.
     */
    function codePointUnchecked(pos: number) {
        return codePointAt(text, pos);
    }

    /**
     * Returns the code point for the character at the given position within `text`. If
     * `pos` is outside the bounds set for `text`, `CharacterCodes.EOF` is returned instead.
     */
    function codePointChecked(pos: number) {
        return pos >= 0 && pos < end ? codePointUnchecked(pos) : CharacterCodes.EOF;
    }

    /**
     * Returns the char code for the character at the given position within `text`. This
     * should only be used when pos is guaranteed to be within the bounds of `text` as this
     * function does not perform bounds checks.
     */
    function charCodeUnchecked(pos: number) {
        return text.charCodeAt(pos);
    }

    /**
     * Returns the char code for the character at the given position within `text`. If
     * `pos` is outside the bounds set for `text`, `CharacterCodes.EOF` is returned instead.
     */
    function charCodeChecked(pos: number) {
        return pos >= 0 && pos < end ? charCodeUnchecked(pos) : CharacterCodes.EOF;
    }

    function error(message: DiagnosticMessage): void;
    function error(message: DiagnosticMessage, errPos: number, length: number, arg0?: any): void;
    function error(message: DiagnosticMessage, errPos: number = pos, length?: number, arg0?: any): void {
        if (onError) {
            const oldPos = pos;
            pos = errPos;
            onError(message, length || 0, arg0);
            pos = oldPos;
        }
    }

    function scanNumberFragment(): string {
        let start = pos;
        let allowSeparator = false;
        let isPreviousTokenSeparator = false;
        let result = "";
        while (true) {
            const ch = charCodeUnchecked(pos);
            if (ch === CharacterCodes._) {
                tokenFlags |= TokenFlags.ContainsSeparator;
                if (allowSeparator) {
                    allowSeparator = false;
                    isPreviousTokenSeparator = true;
                    result += text.substring(start, pos);
                }
                else {
                    tokenFlags |= TokenFlags.ContainsInvalidSeparator;
                    if (isPreviousTokenSeparator) {
                        error(Diagnostics.Multiple_consecutive_numeric_separators_are_not_permitted, pos, 1);
                    }
                    else {
                        error(Diagnostics.Numeric_separators_are_not_allowed_here, pos, 1);
                    }
                }
                pos++;
                start = pos;
                continue;
            }
            if (isDigit(ch)) {
                allowSeparator = true;
                isPreviousTokenSeparator = false;
                pos++;
                continue;
            }
            break;
        }
        if (charCodeUnchecked(pos - 1) === CharacterCodes._) {
            tokenFlags |= TokenFlags.ContainsInvalidSeparator;
            error(Diagnostics.Numeric_separators_are_not_allowed_here, pos - 1, 1);
        }
        return result + text.substring(start, pos);
    }

    // Extract from Section 12.9.3
    // NumericLiteral ::=
    //     | DecimalLiteral
    //     | DecimalBigIntegerLiteral
    //     | NonDecimalIntegerLiteral 'n'?
    //     | LegacyOctalIntegerLiteral
    // DecimalBigIntegerLiteral ::=
    //     | '0n'
    //     | [1-9] DecimalDigits? 'n'
    //     | [1-9] '_' DecimalDigits 'n'
    // DecimalLiteral ::=
    //     | DecimalIntegerLiteral '.' DecimalDigits? ExponentPart?
    //     | '.' DecimalDigits ExponentPart?
    //     | DecimalIntegerLiteral ExponentPart?
    // DecimalIntegerLiteral ::=
    //     | '0'
    //     | [1-9] '_'? DecimalDigits
    //     | NonOctalDecimalIntegerLiteral
    // LegacyOctalIntegerLiteral ::= '0' [0-7]+
    // NonOctalDecimalIntegerLiteral ::= '0' [0-7]* [89] [0-9]*
    function scanNumber(): SyntaxKind {
        let start = pos;
        let mainFragment: string;
        if (charCodeUnchecked(pos) === CharacterCodes._0) {
            pos++;
            if (charCodeUnchecked(pos) === CharacterCodes._) {
                tokenFlags |= TokenFlags.ContainsSeparator | TokenFlags.ContainsInvalidSeparator;
                error(Diagnostics.Numeric_separators_are_not_allowed_here, pos, 1);
                // treat it as a normal number literal
                pos--;
                mainFragment = scanNumberFragment();
            }
            // Separators are not allowed in the below cases
            else if (!scanDigits()) {
                // NonOctalDecimalIntegerLiteral, emit error later
                // Separators in decimal and exponent parts are still allowed according to the spec
                tokenFlags |= TokenFlags.ContainsLeadingZero;
                mainFragment = "" + +tokenValue;
            }
            else if (!tokenValue) {
                // a single zero
                mainFragment = "0";
            }
            else {
                // LegacyOctalIntegerLiteral
                tokenValue = "" + parseInt(tokenValue, 8);
                tokenFlags |= TokenFlags.Octal;
                const withMinus = token === SyntaxKind.MinusToken;
                const literal = (withMinus ? "-" : "") + "0o" + (+tokenValue).toString(8);
                if (withMinus) start--;
                error(Diagnostics.Octal_literals_are_not_allowed_Use_the_syntax_0, start, pos - start, literal);
                return SyntaxKind.NumericLiteral;
            }
        }
        else {
            mainFragment = scanNumberFragment();
        }
        let decimalFragment: string | undefined;
        let scientificFragment: string | undefined;
        if (charCodeUnchecked(pos) === CharacterCodes.dot) {
            pos++;
            decimalFragment = scanNumberFragment();
        }
        let end = pos;
        if (charCodeUnchecked(pos) === CharacterCodes.E || charCodeUnchecked(pos) === CharacterCodes.e) {
            pos++;
            tokenFlags |= TokenFlags.Scientific;
            if (charCodeUnchecked(pos) === CharacterCodes.plus || charCodeUnchecked(pos) === CharacterCodes.minus) pos++;
            const preNumericPart = pos;
            const finalFragment = scanNumberFragment();
            if (!finalFragment) {
                error(Diagnostics.Digit_expected);
            }
            else {
                scientificFragment = text.substring(end, preNumericPart) + finalFragment;
                end = pos;
            }
        }
        let result: string;
        if (tokenFlags & TokenFlags.ContainsSeparator) {
            result = mainFragment;
            if (decimalFragment) {
                result += "." + decimalFragment;
            }
            if (scientificFragment) {
                result += scientificFragment;
            }
        }
        else {
            result = text.substring(start, end); // No need to use all the fragments; no _ removal needed
        }

        if (tokenFlags & TokenFlags.ContainsLeadingZero) {
            error(Diagnostics.Decimals_with_leading_zeros_are_not_allowed, start, end - start);
            // if a literal has a leading zero, it must not be bigint
            tokenValue = "" + +result;
            return SyntaxKind.NumericLiteral;
        }

        if (decimalFragment !== undefined || tokenFlags & TokenFlags.Scientific) {
            checkForIdentifierStartAfterNumericLiteral(start, decimalFragment === undefined && !!(tokenFlags & TokenFlags.Scientific));
            // if value is not an integer, it can be safely coerced to a number
            tokenValue = "" + +result;
            return SyntaxKind.NumericLiteral;
        }
        else {
            tokenValue = result;
            const type = checkBigIntSuffix(); // if value is an integer, check whether it is a bigint
            checkForIdentifierStartAfterNumericLiteral(start);
            return type;
        }
    }

    function checkForIdentifierStartAfterNumericLiteral(numericStart: number, isScientific?: boolean) {
        if (!isIdentifierStart(codePointUnchecked(pos), languageVersion)) {
            return;
        }

        const identifierStart = pos;
        const { length } = scanIdentifierParts();

        if (length === 1 && text[identifierStart] === "n") {
            if (isScientific) {
                error(Diagnostics.A_bigint_literal_cannot_use_exponential_notation, numericStart, identifierStart - numericStart + 1);
            }
            else {
                error(Diagnostics.A_bigint_literal_must_be_an_integer, numericStart, identifierStart - numericStart + 1);
            }
        }
        else {
            error(Diagnostics.An_identifier_or_keyword_cannot_immediately_follow_a_numeric_literal, identifierStart, length);
            pos = identifierStart;
        }
    }

    function scanDigits(): boolean {
        const start = pos;
        let isOctal = true;
        while (isDigit(charCodeChecked(pos))) {
            if (!isOctalDigit(charCodeUnchecked(pos))) {
                isOctal = false;
            }
            pos++;
        }
        tokenValue = text.substring(start, pos);
        return isOctal;
    }

    /**
     * Scans the given number of hexadecimal digits in the text,
     * returning -1 if the given number is unavailable.
     */
    function scanExactNumberOfHexDigits(count: number, canHaveSeparators: boolean): number {
        const valueString = scanHexDigits(/*minCount*/ count, /*scanAsManyAsPossible*/ false, canHaveSeparators);
        return valueString ? parseInt(valueString, 16) : -1;
    }

    /**
     * Scans as many hexadecimal digits as are available in the text,
     * returning "" if the given number of digits was unavailable.
     */
    function scanMinimumNumberOfHexDigits(count: number, canHaveSeparators: boolean): string {
        return scanHexDigits(/*minCount*/ count, /*scanAsManyAsPossible*/ true, canHaveSeparators);
    }

    function scanHexDigits(minCount: number, scanAsManyAsPossible: boolean, canHaveSeparators: boolean): string {
        let valueChars: number[] = [];
        let allowSeparator = false;
        let isPreviousTokenSeparator = false;
        while (valueChars.length < minCount || scanAsManyAsPossible) {
            let ch = charCodeUnchecked(pos);
            if (canHaveSeparators && ch === CharacterCodes._) {
                tokenFlags |= TokenFlags.ContainsSeparator;
                if (allowSeparator) {
                    allowSeparator = false;
                    isPreviousTokenSeparator = true;
                }
                else if (isPreviousTokenSeparator) {
                    error(Diagnostics.Multiple_consecutive_numeric_separators_are_not_permitted, pos, 1);
                }
                else {
                    error(Diagnostics.Numeric_separators_are_not_allowed_here, pos, 1);
                }
                pos++;
                continue;
            }
            allowSeparator = canHaveSeparators;
            if (ch >= CharacterCodes.A && ch <= CharacterCodes.F) {
                ch += CharacterCodes.a - CharacterCodes.A; // standardize hex literals to lowercase
            }
            else if (
                !((ch >= CharacterCodes._0 && ch <= CharacterCodes._9) ||
                    (ch >= CharacterCodes.a && ch <= CharacterCodes.f))
            ) {
                break;
            }
            valueChars.push(ch);
            pos++;
            isPreviousTokenSeparator = false;
        }
        if (valueChars.length < minCount) {
            valueChars = [];
        }
        if (charCodeUnchecked(pos - 1) === CharacterCodes._) {
            error(Diagnostics.Numeric_separators_are_not_allowed_here, pos - 1, 1);
        }
        return String.fromCharCode(...valueChars);
    }

    function scanString(jsxAttributeString = false): string {
        const quote = charCodeUnchecked(pos);
        pos++;
        let result = "";
        let start = pos;
        while (true) {
            if (pos >= end) {
                result += text.substring(start, pos);
                tokenFlags |= TokenFlags.Unterminated;
                error(Diagnostics.Unterminated_string_literal);
                break;
            }
            const ch = charCodeUnchecked(pos);
            if (ch === quote) {
                result += text.substring(start, pos);
                pos++;
                break;
            }
            if (ch === CharacterCodes.backslash && !jsxAttributeString) {
                result += text.substring(start, pos);
                result += scanEscapeSequence(EscapeSequenceScanningFlags.String | EscapeSequenceScanningFlags.ReportErrors);
                start = pos;
                continue;
            }

            if ((ch === CharacterCodes.lineFeed || ch === CharacterCodes.carriageReturn) && !jsxAttributeString) {
                result += text.substring(start, pos);
                tokenFlags |= TokenFlags.Unterminated;
                error(Diagnostics.Unterminated_string_literal);
                break;
            }
            pos++;
        }
        return result;
    }

    /**
     * Sets the current 'tokenValue' and returns a NoSubstitutionTemplateLiteral or
     * a literal component of a TemplateExpression.
     */
    function scanTemplateAndSetTokenValue(shouldEmitInvalidEscapeError: boolean): SyntaxKind {
        const startedWithBacktick = charCodeUnchecked(pos) === CharacterCodes.backtick;

        pos++;
        let start = pos;
        let contents = "";
        let resultingToken: SyntaxKind;

        while (true) {
            if (pos >= end) {
                contents += text.substring(start, pos);
                tokenFlags |= TokenFlags.Unterminated;
                error(Diagnostics.Unterminated_template_literal);
                resultingToken = startedWithBacktick ? SyntaxKind.NoSubstitutionTemplateLiteral : SyntaxKind.TemplateTail;
                break;
            }

            const currChar = charCodeUnchecked(pos);

            // '`'
            if (currChar === CharacterCodes.backtick) {
                contents += text.substring(start, pos);
                pos++;
                resultingToken = startedWithBacktick ? SyntaxKind.NoSubstitutionTemplateLiteral : SyntaxKind.TemplateTail;
                break;
            }

            // '${'
            if (currChar === CharacterCodes.$ && pos + 1 < end && charCodeUnchecked(pos + 1) === CharacterCodes.openBrace) {
                contents += text.substring(start, pos);
                pos += 2;
                resultingToken = startedWithBacktick ? SyntaxKind.TemplateHead : SyntaxKind.TemplateMiddle;
                break;
            }

            // Escape character
            if (currChar === CharacterCodes.backslash) {
                contents += text.substring(start, pos);
                contents += scanEscapeSequence(EscapeSequenceScanningFlags.String | (shouldEmitInvalidEscapeError ? EscapeSequenceScanningFlags.ReportErrors : 0));
                start = pos;
                continue;
            }

            // Speculated ECMAScript 6 Spec 11.8.6.1:
            // <CR><LF> and <CR> LineTerminatorSequences are normalized to <LF> for Template Values
            if (currChar === CharacterCodes.carriageReturn) {
                contents += text.substring(start, pos);
                pos++;

                if (pos < end && charCodeUnchecked(pos) === CharacterCodes.lineFeed) {
                    pos++;
                }

                contents += "\n";
                start = pos;
                continue;
            }

            pos++;
        }

        Debug.assert(resultingToken !== undefined);

        tokenValue = contents;
        return resultingToken;
    }

    // Extract from Section A.1
    // EscapeSequence ::=
    //     | CharacterEscapeSequence
    //     | 0 (?![0-9])
    //     | LegacyOctalEscapeSequence
    //     | NonOctalDecimalEscapeSequence
    //     | HexEscapeSequence
    //     | UnicodeEscapeSequence
    // LegacyOctalEscapeSequence ::=
    //     | '0' (?=[89])
    //     | [1-7] (?![0-7])
    //     | [0-3] [0-7] [0-7]?
    //     | [4-7] [0-7]
    // NonOctalDecimalEscapeSequence ::= [89]
    function scanEscapeSequence(flags: EscapeSequenceScanningFlags): string {
        const start = pos;
        pos++;
        if (pos >= end) {
            error(Diagnostics.Unexpected_end_of_text);
            return "";
        }
        const ch = charCodeUnchecked(pos);
        pos++;
        switch (ch) {
            case CharacterCodes._0:
                // Although '0' preceding any digit is treated as LegacyOctalEscapeSequence,
                // '\08' should separately be interpreted as '\0' + '8'.
                if (pos >= end || !isDigit(charCodeUnchecked(pos))) {
                    return "\0";
                }
            // '\01', '\011'
            // falls through
            case CharacterCodes._1:
            case CharacterCodes._2:
            case CharacterCodes._3:
                // '\1', '\17', '\177'
                if (pos < end && isOctalDigit(charCodeUnchecked(pos))) {
                    pos++;
                }
            // '\17', '\177'
            // falls through
            case CharacterCodes._4:
            case CharacterCodes._5:
            case CharacterCodes._6:
            case CharacterCodes._7:
                // '\4', '\47' but not '\477'
                if (pos < end && isOctalDigit(charCodeUnchecked(pos))) {
                    pos++;
                }
                // '\47'
                tokenFlags |= TokenFlags.ContainsInvalidEscape;
                if (flags & EscapeSequenceScanningFlags.ReportInvalidEscapeErrors) {
                    const code = parseInt(text.substring(start + 1, pos), 8);
                    if (flags & EscapeSequenceScanningFlags.RegularExpression && !(flags & EscapeSequenceScanningFlags.AtomEscape) && ch !== CharacterCodes._0) {
                        error(Diagnostics.Octal_escape_sequences_and_backreferences_are_not_allowed_in_a_character_class_If_this_was_intended_as_an_escape_sequence_use_the_syntax_0_instead, start, pos - start, "\\x" + code.toString(16).padStart(2, "0"));
                    }
                    else {
                        error(Diagnostics.Octal_escape_sequences_are_not_allowed_Use_the_syntax_0, start, pos - start, "\\x" + code.toString(16).padStart(2, "0"));
                    }
                    return String.fromCharCode(code);
                }
                return text.substring(start, pos);
            case CharacterCodes._8:
            case CharacterCodes._9:
                // the invalid '\8' and '\9'
                tokenFlags |= TokenFlags.ContainsInvalidEscape;
                if (flags & EscapeSequenceScanningFlags.ReportInvalidEscapeErrors) {
                    if (flags & EscapeSequenceScanningFlags.RegularExpression && !(flags & EscapeSequenceScanningFlags.AtomEscape)) {
                        error(Diagnostics.Decimal_escape_sequences_and_backreferences_are_not_allowed_in_a_character_class, start, pos - start);
                    }
                    else {
                        error(Diagnostics.Escape_sequence_0_is_not_allowed, start, pos - start, text.substring(start, pos));
                    }
                    return String.fromCharCode(ch);
                }
                return text.substring(start, pos);
            case CharacterCodes.b:
                return "\b";
            case CharacterCodes.t:
                return "\t";
            case CharacterCodes.n:
                return "\n";
            case CharacterCodes.v:
                return "\v";
            case CharacterCodes.f:
                return "\f";
            case CharacterCodes.r:
                return "\r";
            case CharacterCodes.singleQuote:
                return "'";
            case CharacterCodes.doubleQuote:
                return '"';
            case CharacterCodes.u:
                if (
                    flags & EscapeSequenceScanningFlags.ScanExtendedUnicodeEscape &&
                    pos < end && charCodeUnchecked(pos) === CharacterCodes.openBrace
                ) {
                    // '\u{DDDDDD}'
                    pos -= 2;
                    return scanExtendedUnicodeEscape(!!(flags & EscapeSequenceScanningFlags.ReportInvalidEscapeErrors));
                }
                // '\uDDDD'
                for (; pos < start + 6; pos++) {
                    if (!(pos < end && isHexDigit(charCodeUnchecked(pos)))) {
                        tokenFlags |= TokenFlags.ContainsInvalidEscape;
                        if (flags & EscapeSequenceScanningFlags.ReportInvalidEscapeErrors) {
                            error(Diagnostics.Hexadecimal_digit_expected);
                        }
                        return text.substring(start, pos);
                    }
                }
                tokenFlags |= TokenFlags.UnicodeEscape;
                const escapedValue = parseInt(text.substring(start + 2, pos), 16);
                const escapedValueString = String.fromCharCode(escapedValue);
                if (
                    flags & EscapeSequenceScanningFlags.AnyUnicodeMode && escapedValue >= 0xD800 && escapedValue <= 0xDBFF &&
                    pos + 6 < end && text.substring(pos, pos + 2) === "\\u" && charCodeUnchecked(pos + 2) !== CharacterCodes.openBrace
                ) {
                    // For regular expressions in any Unicode mode, \u HexLeadSurrogate \u HexTrailSurrogate is treated as a single character
                    // for the purpose of determining whether a character class range is out of order
                    // https://tc39.es/ecma262/#prod-RegExpUnicodeEscapeSequence
                    const nextStart = pos;
                    let nextPos = pos + 2;
                    for (; nextPos < nextStart + 6; nextPos++) {
                        if (!isHexDigit(charCodeUnchecked(pos))) {
                            // leave the error to the next call
                            return escapedValueString;
                        }
                    }
                    const nextEscapedValue = parseInt(text.substring(nextStart + 2, nextPos), 16);
                    if (nextEscapedValue >= 0xDC00 && nextEscapedValue <= 0xDFFF) {
                        pos = nextPos;
                        return escapedValueString + String.fromCharCode(nextEscapedValue);
                    }
                }
                return escapedValueString;

            case CharacterCodes.x:
                // '\xDD'
                for (; pos < start + 4; pos++) {
                    if (!(pos < end && isHexDigit(charCodeUnchecked(pos)))) {
                        tokenFlags |= TokenFlags.ContainsInvalidEscape;
                        if (flags & EscapeSequenceScanningFlags.ReportInvalidEscapeErrors) {
                            error(Diagnostics.Hexadecimal_digit_expected);
                        }
                        return text.substring(start, pos);
                    }
                }
                tokenFlags |= TokenFlags.HexEscape;
                return String.fromCharCode(parseInt(text.substring(start + 2, pos), 16));

            // when encountering a LineContinuation (i.e. a backslash and a line terminator sequence),
            // the line terminator is interpreted to be "the empty code unit sequence".
            case CharacterCodes.carriageReturn:
                if (pos < end && charCodeUnchecked(pos) === CharacterCodes.lineFeed) {
                    pos++;
                }
            // falls through
            case CharacterCodes.lineFeed:
            case CharacterCodes.lineSeparator:
            case CharacterCodes.paragraphSeparator:
                return "";
            default:
                if (
                    flags & EscapeSequenceScanningFlags.AnyUnicodeMode
                    || flags & EscapeSequenceScanningFlags.RegularExpression
                        && !(flags & EscapeSequenceScanningFlags.AnnexB)
                        && isIdentifierPart(ch, languageVersion)
                ) {
                    error(Diagnostics.This_character_cannot_be_escaped_in_a_regular_expression, pos - 2, 2);
                }
                return String.fromCharCode(ch);
        }
    }

    function scanExtendedUnicodeEscape(shouldEmitInvalidEscapeError: boolean): string {
        const start = pos;
        pos += 3;
        const escapedStart = pos;
        const escapedValueString = scanMinimumNumberOfHexDigits(1, /*canHaveSeparators*/ false);
        const escapedValue = escapedValueString ? parseInt(escapedValueString, 16) : -1;
        let isInvalidExtendedEscape = false;

        // Validate the value of the digit
        if (escapedValue < 0) {
            if (shouldEmitInvalidEscapeError) {
                error(Diagnostics.Hexadecimal_digit_expected);
            }
            isInvalidExtendedEscape = true;
        }
        else if (escapedValue > 0x10FFFF) {
            if (shouldEmitInvalidEscapeError) {
                error(Diagnostics.An_extended_Unicode_escape_value_must_be_between_0x0_and_0x10FFFF_inclusive, escapedStart, pos - escapedStart);
            }
            isInvalidExtendedEscape = true;
        }

        if (pos >= end) {
            if (shouldEmitInvalidEscapeError) {
                error(Diagnostics.Unexpected_end_of_text);
            }
            isInvalidExtendedEscape = true;
        }
        else if (charCodeUnchecked(pos) === CharacterCodes.closeBrace) {
            // Only swallow the following character up if it's a '}'.
            pos++;
        }
        else {
            if (shouldEmitInvalidEscapeError) {
                error(Diagnostics.Unterminated_Unicode_escape_sequence);
            }
            isInvalidExtendedEscape = true;
        }

        if (isInvalidExtendedEscape) {
            tokenFlags |= TokenFlags.ContainsInvalidEscape;
            return text.substring(start, pos);
        }

        tokenFlags |= TokenFlags.ExtendedUnicodeEscape;
        return utf16EncodeAsString(escapedValue);
    }

    // Current character is known to be a backslash. Check for Unicode escape of the form '\uXXXX'
    // and return code point value if valid Unicode escape is found. Otherwise return -1.
    function peekUnicodeEscape(): number {
        if (pos + 5 < end && charCodeUnchecked(pos + 1) === CharacterCodes.u) {
            const start = pos;
            pos += 2;
            const value = scanExactNumberOfHexDigits(4, /*canHaveSeparators*/ false);
            pos = start;
            return value;
        }
        return -1;
    }

    function peekExtendedUnicodeEscape(): number {
        if (codePointUnchecked(pos + 1) === CharacterCodes.u && codePointUnchecked(pos + 2) === CharacterCodes.openBrace) {
            const start = pos;
            pos += 3;
            const escapedValueString = scanMinimumNumberOfHexDigits(1, /*canHaveSeparators*/ false);
            const escapedValue = escapedValueString ? parseInt(escapedValueString, 16) : -1;
            pos = start;
            return escapedValue;
        }
        return -1;
    }

    function scanIdentifierParts(): string {
        let result = "";
        let start = pos;
        while (pos < end) {
            let ch = codePointUnchecked(pos);
            if (isIdentifierPart(ch, languageVersion)) {
                pos += charSize(ch);
            }
            else if (ch === CharacterCodes.backslash) {
                ch = peekExtendedUnicodeEscape();
                if (ch >= 0 && isIdentifierPart(ch, languageVersion)) {
                    result += scanExtendedUnicodeEscape(/*shouldEmitInvalidEscapeError*/ true);
                    start = pos;
                    continue;
                }
                ch = peekUnicodeEscape();
                if (!(ch >= 0 && isIdentifierPart(ch, languageVersion))) {
                    break;
                }
                tokenFlags |= TokenFlags.UnicodeEscape;
                result += text.substring(start, pos);
                result += utf16EncodeAsString(ch);
                // Valid Unicode escape is always six characters
                pos += 6;
                start = pos;
            }
            else {
                break;
            }
        }
        result += text.substring(start, pos);
        return result;
    }

    function getIdentifierToken(): SyntaxKind.Identifier | KeywordSyntaxKind {
        // Reserved words are between 2 and 12 characters long and start with a lowercase letter
        const len = tokenValue.length;
        if (len >= 2 && len <= 12) {
            const ch = tokenValue.charCodeAt(0);
            if (ch >= CharacterCodes.a && ch <= CharacterCodes.z) {
                const keyword = textToKeyword.get(tokenValue);
                if (keyword !== undefined) {
                    return token = keyword;
                }
            }
        }
        return token = SyntaxKind.Identifier;
    }

    function scanBinaryOrOctalDigits(base: 2 | 8): string {
        let value = "";
        // For counting number of digits; Valid binaryIntegerLiteral must have at least one binary digit following B or b.
        // Similarly valid octalIntegerLiteral must have at least one octal digit following o or O.
        let separatorAllowed = false;
        let isPreviousTokenSeparator = false;
        while (true) {
            const ch = charCodeUnchecked(pos);
            // Numeric separators are allowed anywhere within a numeric literal, except not at the beginning, or following another separator
            if (ch === CharacterCodes._) {
                tokenFlags |= TokenFlags.ContainsSeparator;
                if (separatorAllowed) {
                    separatorAllowed = false;
                    isPreviousTokenSeparator = true;
                }
                else if (isPreviousTokenSeparator) {
                    error(Diagnostics.Multiple_consecutive_numeric_separators_are_not_permitted, pos, 1);
                }
                else {
                    error(Diagnostics.Numeric_separators_are_not_allowed_here, pos, 1);
                }
                pos++;
                continue;
            }
            separatorAllowed = true;
            if (!isDigit(ch) || ch - CharacterCodes._0 >= base) {
                break;
            }
            value += text[pos];
            pos++;
            isPreviousTokenSeparator = false;
        }
        if (charCodeUnchecked(pos - 1) === CharacterCodes._) {
            // Literal ends with underscore - not allowed
            error(Diagnostics.Numeric_separators_are_not_allowed_here, pos - 1, 1);
        }
        return value;
    }

    function checkBigIntSuffix(): SyntaxKind {
        if (charCodeUnchecked(pos) === CharacterCodes.n) {
            tokenValue += "n";
            // Use base 10 instead of base 2 or base 8 for shorter literals
            if (tokenFlags & TokenFlags.BinaryOrOctalSpecifier) {
                tokenValue = parsePseudoBigInt(tokenValue) + "n";
            }
            pos++;
            return SyntaxKind.BigIntLiteral;
        }
        else { // not a bigint, so can convert to number in simplified form
            // Number() may not support 0b or 0o, so use parseInt() instead
            const numericValue = tokenFlags & TokenFlags.BinarySpecifier
                ? parseInt(tokenValue.slice(2), 2) // skip "0b"
                : tokenFlags & TokenFlags.OctalSpecifier
                ? parseInt(tokenValue.slice(2), 8) // skip "0o"
                : +tokenValue;
            tokenValue = "" + numericValue;
            return SyntaxKind.NumericLiteral;
        }
    }

    function scan(): SyntaxKind {
        fullStartPos = pos;
        tokenFlags = TokenFlags.None;
        let asteriskSeen = false;
        while (true) {
            tokenStart = pos;
            if (pos >= end) {
                return token = SyntaxKind.EndOfFileToken;
            }

            const ch = codePointUnchecked(pos);

            if (ch === CharacterCodes.lineFeed || ch === CharacterCodes.carriageReturn) {
                tokenFlags |= TokenFlags.PrecedingLineBreak;
                if (skipTrivia) {
                    pos++;
                    continue;
                }
                else {
                    if (ch === CharacterCodes.carriageReturn && pos + 1 < end && charCodeUnchecked(pos + 1) === CharacterCodes.lineFeed) {
                        // consume both CR and LF
                        pos += 2;
                    }
                    else {
                        pos++;
                    }
                    return token = SyntaxKind.NewLineTrivia;
                }
            }

            const tokenCategory = ch < tokenCategoryLookup.length ?
                tokenCategoryLookup[ch] :
                tokenCategoryLookupUncommon.get(ch) ?? TokenCategory.IdentifierOrUnknown;

            if (tokenCategory === TokenCategory.IdentifierOrUnknown) {
                const identifierKind = scanIdentifier(ch, languageVersion);
                if (identifierKind) {
                    return token = identifierKind;
                }
                const size = charSize(ch);
                error(Diagnostics.Invalid_character, pos, size);
                pos += size;
                return token = SyntaxKind.Unknown;
            }

            if (tokenCategory & TokenCategory.Whitespace) {
                pos++;
                // Tight loop here on consecutive whitespace to avoid a table lookup.
                while (pos < end) {
                    const nextCh = charCodeUnchecked(pos);
                    // Check for the original character to hitting the slow path.
                    if (nextCh === ch || isWhiteSpaceSingleLine(nextCh)) {
                        pos++;
                        continue;
                    }

                    break;
                }

                if (skipTrivia) {
                    continue;
                }
                else {
                    return token = SyntaxKind.WhitespaceTrivia;
                }
            }

            if (tokenCategory & TokenCategory.LineBreak) {
                tokenFlags |= TokenFlags.PrecedingLineBreak;
                pos += charSize(ch);
                continue;
            }

            if (tokenCategory & TokenCategory.SimpleToken) {
                pos++;
                return token = tokenCategory & TokenCategory.SimpleTokenMask;
            }

            if (tokenCategory & TokenCategory.Digit) {
                if (ch === CharacterCodes._0) {
                    if (pos + 2 < end && (charCodeUnchecked(pos + 1) === CharacterCodes.X || charCodeUnchecked(pos + 1) === CharacterCodes.x)) {
                        pos += 2;
                        tokenValue = scanMinimumNumberOfHexDigits(1, /*canHaveSeparators*/ true);
                        if (!tokenValue) {
                            error(Diagnostics.Hexadecimal_digit_expected);
                            tokenValue = "0";
                        }
                        tokenValue = "0x" + tokenValue;
                        tokenFlags |= TokenFlags.HexSpecifier;
                        return token = checkBigIntSuffix();
                    }
                    else if (pos + 2 < end && (charCodeUnchecked(pos + 1) === CharacterCodes.B || charCodeUnchecked(pos + 1) === CharacterCodes.b)) {
                        pos += 2;
                        tokenValue = scanBinaryOrOctalDigits(/* base */ 2);
                        if (!tokenValue) {
                            error(Diagnostics.Binary_digit_expected);
                            tokenValue = "0";
                        }
                        tokenValue = "0b" + tokenValue;
                        tokenFlags |= TokenFlags.BinarySpecifier;
                        return token = checkBigIntSuffix();
                    }
                    else if (pos + 2 < end && (charCodeUnchecked(pos + 1) === CharacterCodes.O || charCodeUnchecked(pos + 1) === CharacterCodes.o)) {
                        pos += 2;
                        tokenValue = scanBinaryOrOctalDigits(/* base */ 8);
                        if (!tokenValue) {
                            error(Diagnostics.Octal_digit_expected);
                            tokenValue = "0";
                        }
                        tokenValue = "0o" + tokenValue;
                        tokenFlags |= TokenFlags.OctalSpecifier;
                        return token = checkBigIntSuffix();
                    }
                }

                return token = scanNumber();
            }

            if (!(tokenCategory & TokenCategory.RecognizedMisc)) Debug.fail(`Unhandled token category ${tokenCategory}`);
            switch (ch) {
                case CharacterCodes.exclamation:
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.equals) {
                        if (charCodeUnchecked(pos + 2) === CharacterCodes.equals) {
                            return pos += 3, token = SyntaxKind.ExclamationEqualsEqualsToken;
                        }
                        return pos += 2, token = SyntaxKind.ExclamationEqualsToken;
                    }
                    pos++;
                    return token = SyntaxKind.ExclamationToken;
                case CharacterCodes.doubleQuote:
                case CharacterCodes.singleQuote:
                    tokenValue = scanString();
                    return token = SyntaxKind.StringLiteral;
                case CharacterCodes.backtick:
                    return token = scanTemplateAndSetTokenValue(/*shouldEmitInvalidEscapeError*/ false);
                case CharacterCodes.percent:
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.equals) {
                        return pos += 2, token = SyntaxKind.PercentEqualsToken;
                    }
                    pos++;
                    return token = SyntaxKind.PercentToken;
                case CharacterCodes.ampersand:
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.ampersand) {
                        if (charCodeUnchecked(pos + 2) === CharacterCodes.equals) {
                            return pos += 3, token = SyntaxKind.AmpersandAmpersandEqualsToken;
                        }
                        return pos += 2, token = SyntaxKind.AmpersandAmpersandToken;
                    }
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.equals) {
                        return pos += 2, token = SyntaxKind.AmpersandEqualsToken;
                    }
                    pos++;
                    return token = SyntaxKind.AmpersandToken;
                case CharacterCodes.asterisk:
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.equals) {
                        return pos += 2, token = SyntaxKind.AsteriskEqualsToken;
                    }
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.asterisk) {
                        if (charCodeUnchecked(pos + 2) === CharacterCodes.equals) {
                            return pos += 3, token = SyntaxKind.AsteriskAsteriskEqualsToken;
                        }
                        return pos += 2, token = SyntaxKind.AsteriskAsteriskToken;
                    }
                    pos++;
                    if (skipJsDocLeadingAsterisks && !asteriskSeen && (tokenFlags & TokenFlags.PrecedingLineBreak)) {
                        // decoration at the start of a JSDoc comment line
                        asteriskSeen = true;
                        continue;
                    }
                    return token = SyntaxKind.AsteriskToken;
                case CharacterCodes.plus:
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.plus) {
                        return pos += 2, token = SyntaxKind.PlusPlusToken;
                    }
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.equals) {
                        return pos += 2, token = SyntaxKind.PlusEqualsToken;
                    }
                    pos++;
                    return token = SyntaxKind.PlusToken;
                case CharacterCodes.minus:
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.minus) {
                        return pos += 2, token = SyntaxKind.MinusMinusToken;
                    }
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.equals) {
                        return pos += 2, token = SyntaxKind.MinusEqualsToken;
                    }
                    pos++;
                    return token = SyntaxKind.MinusToken;
                case CharacterCodes.dot:
                    if (isDigit(charCodeUnchecked(pos + 1))) {
                        scanNumber();
                        return token = SyntaxKind.NumericLiteral;
                    }
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.dot && charCodeUnchecked(pos + 2) === CharacterCodes.dot) {
                        return pos += 3, token = SyntaxKind.DotDotDotToken;
                    }
                    pos++;
                    return token = SyntaxKind.DotToken;
                case CharacterCodes.slash:
                    // Single-line comment
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.slash) {
                        pos += 2;

                        while (pos < end) {
                            if (isLineBreak(charCodeUnchecked(pos))) {
                                break;
                            }
                            pos++;
                        }

                        commentDirectives = appendIfCommentDirective(
                            commentDirectives,
                            text.slice(tokenStart, pos),
                            commentDirectiveRegExSingleLine,
                            tokenStart,
                        );

                        if (skipTrivia) {
                            continue;
                        }
                        else {
                            return token = SyntaxKind.SingleLineCommentTrivia;
                        }
                    }
                    // Multi-line comment
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.asterisk) {
                        pos += 2;
                        const isJSDoc = charCodeUnchecked(pos) === CharacterCodes.asterisk && charCodeUnchecked(pos + 1) !== CharacterCodes.slash;

                        let commentClosed = false;
                        let lastLineStart = tokenStart;
                        while (pos < end) {
                            const ch = charCodeUnchecked(pos);

                            if (ch === CharacterCodes.asterisk && charCodeUnchecked(pos + 1) === CharacterCodes.slash) {
                                pos += 2;
                                commentClosed = true;
                                break;
                            }

                            pos++;

                            if (isLineBreak(ch)) {
                                lastLineStart = pos;
                                tokenFlags |= TokenFlags.PrecedingLineBreak;
                            }
                        }

                        if (isJSDoc && shouldParseJSDoc()) {
                            tokenFlags |= TokenFlags.PrecedingJSDocComment;
                        }

                        commentDirectives = appendIfCommentDirective(commentDirectives, text.slice(lastLineStart, pos), commentDirectiveRegExMultiLine, lastLineStart);

                        if (!commentClosed) {
                            error(Diagnostics.Asterisk_Slash_expected);
                        }

                        if (skipTrivia) {
                            continue;
                        }
                        else {
                            if (!commentClosed) {
                                tokenFlags |= TokenFlags.Unterminated;
                            }
                            return token = SyntaxKind.MultiLineCommentTrivia;
                        }
                    }

                    if (charCodeUnchecked(pos + 1) === CharacterCodes.equals) {
                        return pos += 2, token = SyntaxKind.SlashEqualsToken;
                    }

                    pos++;
                    return token = SyntaxKind.SlashToken;

                case CharacterCodes.lessThan:
                    if (isConflictMarkerTrivia(text, pos)) {
                        pos = scanConflictMarkerTrivia(text, pos, error);
                        if (skipTrivia) {
                            continue;
                        }
                        else {
                            return token = SyntaxKind.ConflictMarkerTrivia;
                        }
                    }

                    if (charCodeUnchecked(pos + 1) === CharacterCodes.lessThan) {
                        if (charCodeUnchecked(pos + 2) === CharacterCodes.equals) {
                            return pos += 3, token = SyntaxKind.LessThanLessThanEqualsToken;
                        }
                        return pos += 2, token = SyntaxKind.LessThanLessThanToken;
                    }
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.equals) {
                        return pos += 2, token = SyntaxKind.LessThanEqualsToken;
                    }
                    if (
                        languageVariant === LanguageVariant.JSX &&
                        charCodeUnchecked(pos + 1) === CharacterCodes.slash &&
                        charCodeUnchecked(pos + 2) !== CharacterCodes.asterisk
                    ) {
                        return pos += 2, token = SyntaxKind.LessThanSlashToken;
                    }
                    pos++;
                    return token = SyntaxKind.LessThanToken;
                case CharacterCodes.equals:
                    if (isConflictMarkerTrivia(text, pos)) {
                        pos = scanConflictMarkerTrivia(text, pos, error);
                        if (skipTrivia) {
                            continue;
                        }
                        else {
                            return token = SyntaxKind.ConflictMarkerTrivia;
                        }
                    }

                    if (charCodeUnchecked(pos + 1) === CharacterCodes.equals) {
                        if (charCodeUnchecked(pos + 2) === CharacterCodes.equals) {
                            return pos += 3, token = SyntaxKind.EqualsEqualsEqualsToken;
                        }
                        return pos += 2, token = SyntaxKind.EqualsEqualsToken;
                    }
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.greaterThan) {
                        return pos += 2, token = SyntaxKind.EqualsGreaterThanToken;
                    }
                    pos++;
                    return token = SyntaxKind.EqualsToken;
                case CharacterCodes.greaterThan:
                    if (isConflictMarkerTrivia(text, pos)) {
                        pos = scanConflictMarkerTrivia(text, pos, error);
                        if (skipTrivia) {
                            continue;
                        }
                        else {
                            return token = SyntaxKind.ConflictMarkerTrivia;
                        }
                    }

                    pos++;
                    return token = SyntaxKind.GreaterThanToken;
                case CharacterCodes.question:
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.dot && !isDigit(charCodeUnchecked(pos + 2))) {
                        return pos += 2, token = SyntaxKind.QuestionDotToken;
                    }
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.question) {
                        if (charCodeUnchecked(pos + 2) === CharacterCodes.equals) {
                            return pos += 3, token = SyntaxKind.QuestionQuestionEqualsToken;
                        }
                        return pos += 2, token = SyntaxKind.QuestionQuestionToken;
                    }
                    pos++;
                    return token = SyntaxKind.QuestionToken;
                case CharacterCodes.caret:
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.equals) {
                        return pos += 2, token = SyntaxKind.CaretEqualsToken;
                    }
                    pos++;
                    return token = SyntaxKind.CaretToken;
                case CharacterCodes.bar:
                    if (isConflictMarkerTrivia(text, pos)) {
                        pos = scanConflictMarkerTrivia(text, pos, error);
                        if (skipTrivia) {
                            continue;
                        }
                        else {
                            return token = SyntaxKind.ConflictMarkerTrivia;
                        }
                    }

                    if (charCodeUnchecked(pos + 1) === CharacterCodes.bar) {
                        if (charCodeUnchecked(pos + 2) === CharacterCodes.equals) {
                            return pos += 3, token = SyntaxKind.BarBarEqualsToken;
                        }
                        return pos += 2, token = SyntaxKind.BarBarToken;
                    }
                    if (charCodeUnchecked(pos + 1) === CharacterCodes.equals) {
                        return pos += 2, token = SyntaxKind.BarEqualsToken;
                    }
                    pos++;
                    return token = SyntaxKind.BarToken;
                case CharacterCodes.backslash:
                    const extendedCookedChar = peekExtendedUnicodeEscape();
                    if (extendedCookedChar >= 0 && isIdentifierStart(extendedCookedChar, languageVersion)) {
                        tokenValue = scanExtendedUnicodeEscape(/*shouldEmitInvalidEscapeError*/ true) + scanIdentifierParts();
                        return token = getIdentifierToken();
                    }

                    const cookedChar = peekUnicodeEscape();
                    if (cookedChar >= 0 && isIdentifierStart(cookedChar, languageVersion)) {
                        pos += 6;
                        tokenFlags |= TokenFlags.UnicodeEscape;
                        tokenValue = String.fromCharCode(cookedChar) + scanIdentifierParts();
                        return token = getIdentifierToken();
                    }

                    error(Diagnostics.Invalid_character);
                    pos++;
                    return token = SyntaxKind.Unknown;
                case CharacterCodes.hash:
                    const charAfterHash = codePointUnchecked(pos + 1);

                    if (charAfterHash === CharacterCodes.exclamation) {
                        if (pos === 0) {
                            pos = scanShebangTrivia(text, pos);
                            if (skipTrivia) {
                                continue;
                            }
                            else {
                                return token = SyntaxKind.ShebangTrivia;
                            }
                        }
                        else if (pos !== 0) {
                            error(Diagnostics.can_only_be_used_at_the_start_of_a_file, pos, 2);
                            pos++;
                            return token = SyntaxKind.Unknown;
                        }
                    }

                    if (charAfterHash === CharacterCodes.backslash) {
                        pos++;
                        const extendedCookedChar = peekExtendedUnicodeEscape();
                        if (extendedCookedChar >= 0 && isIdentifierStart(extendedCookedChar, languageVersion)) {
                            tokenValue = "#" + scanExtendedUnicodeEscape(/*shouldEmitInvalidEscapeError*/ true) + scanIdentifierParts();
                            return token = SyntaxKind.PrivateIdentifier;
                        }

                        const cookedChar = peekUnicodeEscape();
                        if (cookedChar >= 0 && isIdentifierStart(cookedChar, languageVersion)) {
                            pos += 6;
                            tokenFlags |= TokenFlags.UnicodeEscape;
                            tokenValue = "#" + String.fromCharCode(cookedChar) + scanIdentifierParts();
                            return token = SyntaxKind.PrivateIdentifier;
                        }
                        pos--;
                    }

                    if (isIdentifierStart(charAfterHash, languageVersion)) {
                        pos++;
                        // We're relying on scanIdentifier's behavior and adjusting the token kind after the fact.
                        // Notably absent from this block is the fact that calling a function named "scanIdentifier",
                        // but identifiers don't include '#', and that function doesn't deal with it at all.
                        // This works because 'scanIdentifier' tries to reuse source characters and builds up substrings;
                        // however, it starts at the 'tokenPos' which includes the '#', and will "accidentally" prepend the '#' for us.
                        scanIdentifier(charAfterHash, languageVersion);
                    }
                    else {
                        tokenValue = "#";
                        error(Diagnostics.Invalid_character, pos++, charSize(ch));
                    }
                    return token = SyntaxKind.PrivateIdentifier;
                case CharacterCodes.replacementCharacter:
                    error(Diagnostics.File_appears_to_be_binary, 0, 0);
                    pos = end;
                    return token = SyntaxKind.NonTextFileMarkerTrivia;
            }
        }
    }

    function shouldParseJSDoc() {
        switch (jsDocParsingMode) {
            case JSDocParsingMode.ParseAll:
                return true;
            case JSDocParsingMode.ParseNone:
                return false;
        }

        if (scriptKind !== ScriptKind.TS && scriptKind !== ScriptKind.TSX) {
            // If outside of TS, we need JSDoc to get any type info.
            return true;
        }

        if (jsDocParsingMode === JSDocParsingMode.ParseForTypeInfo) {
            // If we're in TS, but we don't need to produce reliable errors,
            // we don't need to parse to find @see or @link.
            return false;
        }

        return jsDocSeeOrLink.test(text.slice(fullStartPos, pos));
    }

    function reScanInvalidIdentifier(): SyntaxKind {
        Debug.assert(token === SyntaxKind.Unknown, "'reScanInvalidIdentifier' should only be called when the current token is 'SyntaxKind.Unknown'.");
        pos = tokenStart = fullStartPos;
        tokenFlags = 0;
        const ch = codePointUnchecked(pos);
        const identifierKind = scanIdentifier(ch, ScriptTarget.ESNext);
        if (identifierKind) {
            return token = identifierKind;
        }
        pos += charSize(ch);
        return token; // Still `SyntaxKind.Unknown`
    }

    function scanIdentifier(startCharacter: number, languageVersion: ScriptTarget) {
        let ch = startCharacter;
        if (isIdentifierStart(ch, languageVersion)) {
            pos += charSize(ch);
            while (pos < end && isIdentifierPart(ch = codePointUnchecked(pos), languageVersion)) pos += charSize(ch);
            tokenValue = text.substring(tokenStart, pos);
            if (ch === CharacterCodes.backslash) {
                tokenValue += scanIdentifierParts();
            }
            return getIdentifierToken();
        }
    }

    function reScanGreaterToken(): SyntaxKind {
        if (token === SyntaxKind.GreaterThanToken) {
            if (charCodeUnchecked(pos) === CharacterCodes.greaterThan) {
                if (charCodeUnchecked(pos + 1) === CharacterCodes.greaterThan) {
                    if (charCodeUnchecked(pos + 2) === CharacterCodes.equals) {
                        return pos += 3, token = SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken;
                    }
                    return pos += 2, token = SyntaxKind.GreaterThanGreaterThanGreaterThanToken;
                }
                if (charCodeUnchecked(pos + 1) === CharacterCodes.equals) {
                    return pos += 2, token = SyntaxKind.GreaterThanGreaterThanEqualsToken;
                }
                pos++;
                return token = SyntaxKind.GreaterThanGreaterThanToken;
            }
            if (charCodeUnchecked(pos) === CharacterCodes.equals) {
                pos++;
                return token = SyntaxKind.GreaterThanEqualsToken;
            }
        }
        return token;
    }

    function reScanAsteriskEqualsToken(): SyntaxKind {
        Debug.assert(token === SyntaxKind.AsteriskEqualsToken, "'reScanAsteriskEqualsToken' should only be called on a '*='");
        pos = tokenStart + 1;
        return token = SyntaxKind.EqualsToken;
    }

    function reScanSlashToken(reportErrors?: boolean): SyntaxKind {
        if (token === SyntaxKind.SlashToken || token === SyntaxKind.SlashEqualsToken) {
            // Quickly get to the end of regex such that we know the flags
            const startOfRegExpBody = tokenStart + 1;
            pos = startOfRegExpBody;
            let inEscape = false;
            let namedCaptureGroups = false;
            // Although nested character classes are allowed in Unicode Sets mode,
            // an unescaped slash is nevertheless invalid even in a character class in any Unicode mode.
            // This is indicated by Section 12.9.5 Regular Expression Literals of the specification,
            // where nested character classes are not considered at all. (A `[` RegularExpressionClassChar
            // does nothing in a RegularExpressionClass, and a `]` always closes the class.)
            // Additionally, parsing nested character classes will misinterpret regexes like `/[[]/`
            // as unterminated, consuming characters beyond the slash. (This even applies to `/[[]/v`,
            // which should be parsed as a well-terminated regex with an incomplete character class.)
            // Thus we must not handle nested character classes in the first pass.
            let inCharacterClass = false;
            while (true) {
                // If we reach the end of a file, or hit a newline, then this is an unterminated
                // regex.  Report error and return what we have so far.
                const ch = charCodeChecked(pos);
                if (ch === CharacterCodes.EOF || isLineBreak(ch)) {
                    tokenFlags |= TokenFlags.Unterminated;
                    break;
                }

                if (inEscape) {
                    // Parsing an escape character;
                    // reset the flag and just advance to the next char.
                    inEscape = false;
                }
                else if (ch === CharacterCodes.slash && !inCharacterClass) {
                    // A slash within a character class is permissible,
                    // but in general it signals the end of the regexp literal.
                    break;
                }
                else if (ch === CharacterCodes.openBracket) {
                    inCharacterClass = true;
                }
                else if (ch === CharacterCodes.backslash) {
                    inEscape = true;
                }
                else if (ch === CharacterCodes.closeBracket) {
                    inCharacterClass = false;
                }
                else if (
                    !inCharacterClass
                    && ch === CharacterCodes.openParen
                    && charCodeChecked(pos + 1) === CharacterCodes.question
                    && charCodeChecked(pos + 2) === CharacterCodes.lessThan
                    && charCodeChecked(pos + 3) !== CharacterCodes.equals
                    && charCodeChecked(pos + 3) !== CharacterCodes.exclamation
                ) {
                    namedCaptureGroups = true;
                }
                pos++;
            }
            const endOfRegExpBody = pos;
            if (tokenFlags & TokenFlags.Unterminated) {
                // Search for the nearest unbalanced bracket for better recovery. Since the expression is
                // invalid anyways, we take nested square brackets into consideration for the best guess.
                pos = startOfRegExpBody;
                inEscape = false;
                let characterClassDepth = 0;
                let inDecimalQuantifier = false;
                let groupDepth = 0;
                while (pos < endOfRegExpBody) {
                    const ch = charCodeUnchecked(pos);
                    if (inEscape) {
                        inEscape = false;
                    }
                    else if (ch === CharacterCodes.backslash) {
                        inEscape = true;
                    }
                    else if (ch === CharacterCodes.openBracket) {
                        characterClassDepth++;
                    }
                    else if (ch === CharacterCodes.closeBracket && characterClassDepth) {
                        characterClassDepth--;
                    }
                    else if (!characterClassDepth) {
                        if (ch === CharacterCodes.openBrace) {
                            inDecimalQuantifier = true;
                        }
                        else if (ch === CharacterCodes.closeBrace && inDecimalQuantifier) {
                            inDecimalQuantifier = false;
                        }
                        else if (!inDecimalQuantifier) {
                            if (ch === CharacterCodes.openParen) {
                                groupDepth++;
                            }
                            else if (ch === CharacterCodes.closeParen && groupDepth) {
                                groupDepth--;
                            }
                            else if (ch === CharacterCodes.closeParen || ch === CharacterCodes.closeBracket || ch === CharacterCodes.closeBrace) {
                                // We encountered an unbalanced bracket outside a character class. Treat this position as the end of regex.
                                break;
                            }
                        }
                    }
                    pos++;
                }
                // Whitespaces and semicolons at the end are not likely to be part of the regex
                while (isWhiteSpaceLike(charCodeChecked(pos - 1)) || charCodeChecked(pos - 1) === CharacterCodes.semicolon) pos--;
                error(Diagnostics.Unterminated_regular_expression_literal, tokenStart, pos - tokenStart);
            }
            else {
                // Consume the slash character
                pos++;
                let regExpFlags = RegularExpressionFlags.None;
                while (true) {
                    const ch = codePointChecked(pos);
                    if (ch === CharacterCodes.EOF || !isIdentifierPart(ch, languageVersion)) {
                        break;
                    }
                    const size = charSize(ch);
                    if (reportErrors) {
                        const flag = characterCodeToRegularExpressionFlag(ch);
                        if (flag === undefined) {
                            error(Diagnostics.Unknown_regular_expression_flag, pos, size);
                        }
                        else if (regExpFlags & flag) {
                            error(Diagnostics.Duplicate_regular_expression_flag, pos, size);
                        }
                        else if (((regExpFlags | flag) & RegularExpressionFlags.AnyUnicodeMode) === RegularExpressionFlags.AnyUnicodeMode) {
                            error(Diagnostics.The_Unicode_u_flag_and_the_Unicode_Sets_v_flag_cannot_be_set_simultaneously, pos, size);
                        }
                        else {
                            regExpFlags |= flag;
                            checkRegularExpressionFlagAvailability(flag, size);
                        }
                    }
                    pos += size;
                }
                if (reportErrors) {
                    scanRange(startOfRegExpBody, endOfRegExpBody - startOfRegExpBody, () => {
                        scanRegularExpressionWorker(regExpFlags, /*annexB*/ true, namedCaptureGroups);
                    });
                }
            }
            tokenValue = text.substring(tokenStart, pos);
            token = SyntaxKind.RegularExpressionLiteral;
        }
        return token;
    }

    function scanRegularExpressionWorker(regExpFlags: RegularExpressionFlags, annexB: boolean, namedCaptureGroups: boolean) {
        // Why var? It avoids TDZ checks in the runtime which can be costly.
        // See: https://github.com/microsoft/TypeScript/issues/52924
        /* eslint-disable no-var */

        /** Grammar parameter */
        var unicodeSetsMode = !!(regExpFlags & RegularExpressionFlags.UnicodeSets);
        /** Grammar parameter */
        var anyUnicodeMode = !!(regExpFlags & RegularExpressionFlags.AnyUnicodeMode);

        // Regular expressions are checked more strictly when either in 'u' or 'v' mode, or
        // when not using the looser interpretation of the syntax from ECMA-262 Annex B.
        var anyUnicodeModeOrNonAnnexB = anyUnicodeMode || !annexB;

        /** @see {scanClassSetExpression} */
        var mayContainStrings = false;

        /** The number of all (named and unnamed) capturing groups defined in the regex. */
        var numberOfCapturingGroups = 0;
        /** All named capturing groups defined in the regex. */
        var groupSpecifiers: Set<string> | undefined;
        /** All references to named capturing groups in the regex. */
        var groupNameReferences: (TextRange & { name: string; })[] | undefined;
        /** All numeric backreferences within the regex. */
        var decimalEscapes: (TextRange & { value: number; })[] | undefined;
        /** A stack of scopes for named capturing groups. @see {scanGroupName} */
        var namedCapturingGroupsScopeStack: (Set<string> | undefined)[] = [];
        var topNamedCapturingGroupsScope: Set<string> | undefined;
        /* eslint-enable no-var */
        // Disjunction ::= Alternative ('|' Alternative)*
        function scanDisjunction(isInGroup: boolean) {
            while (true) {
                namedCapturingGroupsScopeStack.push(topNamedCapturingGroupsScope);
                topNamedCapturingGroupsScope = undefined;
                scanAlternative(isInGroup);
                topNamedCapturingGroupsScope = namedCapturingGroupsScopeStack.pop();
                if (charCodeChecked(pos) !== CharacterCodes.bar) {
                    return;
                }
                pos++;
            }
        }

        // Alternative ::= Term*
        // Term ::=
        //     | Assertion
        //     | Atom Quantifier?
        // Assertion ::=
        //     | '^'
        //     | '$'
        //     | '\b'
        //     | '\B'
        //     | '(?=' Disjunction ')'
        //     | '(?!' Disjunction ')'
        //     | '(?<=' Disjunction ')'
        //     | '(?<!' Disjunction ')'
        // Quantifier ::= QuantifierPrefix '?'?
        // QuantifierPrefix ::=
        //     | '*'
        //     | '+'
        //     | '?'
        //     | '{' DecimalDigits (',' DecimalDigits?)? '}'
        // Atom ::=
        //     | PatternCharacter
        //     | '.'
        //     | '\' AtomEscape
        //     | CharacterClass
        //     | '(?<' RegExpIdentifierName '>' Disjunction ')'
        //     | '(?' RegularExpressionFlags ('-' RegularExpressionFlags)? ':' Disjunction ')'
        // CharacterClass ::= unicodeMode
        //     ? '[' ClassRanges ']'
        //     : '[' ClassSetExpression ']'
        function scanAlternative(isInGroup: boolean) {
            let isPreviousTermQuantifiable = false;
            while (true) {
                const start = pos;
                const ch = charCodeChecked(pos);
                switch (ch) {
                    case CharacterCodes.EOF:
                        return;
                    case CharacterCodes.caret:
                    case CharacterCodes.$:
                        pos++;
                        isPreviousTermQuantifiable = false;
                        break;
                    case CharacterCodes.backslash:
                        pos++;
                        switch (charCodeChecked(pos)) {
                            case CharacterCodes.b:
                            case CharacterCodes.B:
                                pos++;
                                isPreviousTermQuantifiable = false;
                                break;
                            default:
                                scanAtomEscape();
                                isPreviousTermQuantifiable = true;
                                break;
                        }
                        break;
                    case CharacterCodes.openParen:
                        pos++;
                        if (charCodeChecked(pos) === CharacterCodes.question) {
                            pos++;
                            switch (charCodeChecked(pos)) {
                                case CharacterCodes.equals:
                                case CharacterCodes.exclamation:
                                    pos++;
                                    // In Annex B, `(?=Disjunction)` and `(?!Disjunction)` are quantifiable
                                    isPreviousTermQuantifiable = !anyUnicodeModeOrNonAnnexB;
                                    break;
                                case CharacterCodes.lessThan:
                                    const groupNameStart = pos;
                                    pos++;
                                    switch (charCodeChecked(pos)) {
                                        case CharacterCodes.equals:
                                        case CharacterCodes.exclamation:
                                            pos++;
                                            isPreviousTermQuantifiable = false;
                                            break;
                                        default:
                                            scanGroupName(/*isReference*/ false);
                                            scanExpectedChar(CharacterCodes.greaterThan);
                                            if (languageVersion < ScriptTarget.ES2018) {
                                                error(Diagnostics.Named_capturing_groups_are_only_available_when_targeting_ES2018_or_later, groupNameStart, pos - groupNameStart);
                                            }
                                            numberOfCapturingGroups++;
                                            isPreviousTermQuantifiable = true;
                                            break;
                                    }
                                    break;
                                default:
                                    const start = pos;
                                    const setFlags = scanPatternModifiers(RegularExpressionFlags.None);
                                    if (charCodeChecked(pos) === CharacterCodes.minus) {
                                        pos++;
                                        scanPatternModifiers(setFlags);
                                        if (pos === start + 1) {
                                            error(Diagnostics.Subpattern_flags_must_be_present_when_there_is_a_minus_sign, start, pos - start);
                                        }
                                    }
                                    scanExpectedChar(CharacterCodes.colon);
                                    isPreviousTermQuantifiable = true;
                                    break;
                            }
                        }
                        else {
                            numberOfCapturingGroups++;
                            isPreviousTermQuantifiable = true;
                        }
                        scanDisjunction(/*isInGroup*/ true);
                        scanExpectedChar(CharacterCodes.closeParen);
                        break;
                    case CharacterCodes.openBrace:
                        pos++;
                        const digitsStart = pos;
                        scanDigits();
                        const min = tokenValue;
                        if (!anyUnicodeModeOrNonAnnexB && !min) {
                            isPreviousTermQuantifiable = true;
                            break;
                        }
                        if (charCodeChecked(pos) === CharacterCodes.comma) {
                            pos++;
                            scanDigits();
                            const max = tokenValue;
                            if (!min) {
                                if (max || charCodeChecked(pos) === CharacterCodes.closeBrace) {
                                    error(Diagnostics.Incomplete_quantifier_Digit_expected, digitsStart, 0);
                                }
                                else {
                                    error(Diagnostics.Unexpected_0_Did_you_mean_to_escape_it_with_backslash, start, 1, String.fromCharCode(ch));
                                    isPreviousTermQuantifiable = true;
                                    break;
                                }
                            }
                            else if (max && Number.parseInt(min) > Number.parseInt(max) && (anyUnicodeModeOrNonAnnexB || charCodeChecked(pos) === CharacterCodes.closeBrace)) {
                                error(Diagnostics.Numbers_out_of_order_in_quantifier, digitsStart, pos - digitsStart);
                            }
                        }
                        else if (!min) {
                            if (anyUnicodeModeOrNonAnnexB) {
                                error(Diagnostics.Unexpected_0_Did_you_mean_to_escape_it_with_backslash, start, 1, String.fromCharCode(ch));
                            }
                            isPreviousTermQuantifiable = true;
                            break;
                        }
                        if (charCodeChecked(pos) !== CharacterCodes.closeBrace) {
                            if (anyUnicodeModeOrNonAnnexB) {
                                error(Diagnostics._0_expected, pos, 0, String.fromCharCode(CharacterCodes.closeBrace));
                                pos--;
                            }
                            else {
                                isPreviousTermQuantifiable = true;
                                break;
                            }
                        }
                    // falls through
                    case CharacterCodes.asterisk:
                    case CharacterCodes.plus:
                    case CharacterCodes.question:
                        pos++;
                        if (charCodeChecked(pos) === CharacterCodes.question) {
                            // Non-greedy
                            pos++;
                        }
                        if (!isPreviousTermQuantifiable) {
                            error(Diagnostics.There_is_nothing_available_for_repetition, start, pos - start);
                        }
                        isPreviousTermQuantifiable = false;
                        break;
                    case CharacterCodes.dot:
                        pos++;
                        isPreviousTermQuantifiable = true;
                        break;
                    case CharacterCodes.openBracket:
                        pos++;
                        if (unicodeSetsMode) {
                            scanClassSetExpression();
                        }
                        else {
                            scanClassRanges();
                        }
                        scanExpectedChar(CharacterCodes.closeBracket);
                        isPreviousTermQuantifiable = true;
                        break;
                    case CharacterCodes.closeParen:
                        if (isInGroup) {
                            return;
                        }
                    // falls through
                    case CharacterCodes.closeBracket:
                    case CharacterCodes.closeBrace:
                        if (anyUnicodeModeOrNonAnnexB || ch === CharacterCodes.closeParen) {
                            error(Diagnostics.Unexpected_0_Did_you_mean_to_escape_it_with_backslash, pos, 1, String.fromCharCode(ch));
                        }
                        pos++;
                        isPreviousTermQuantifiable = true;
                        break;
                    case CharacterCodes.slash:
                    case CharacterCodes.bar:
                        return;
                    default:
                        scanSourceCharacter();
                        isPreviousTermQuantifiable = true;
                        break;
                }
            }
        }

        function scanPatternModifiers(currFlags: RegularExpressionFlags): RegularExpressionFlags {
            while (true) {
                const ch = codePointChecked(pos);
                if (ch === CharacterCodes.EOF || !isIdentifierPart(ch, languageVersion)) {
                    break;
                }
                const size = charSize(ch);
                const flag = characterCodeToRegularExpressionFlag(ch);
                if (flag === undefined) {
                    error(Diagnostics.Unknown_regular_expression_flag, pos, size);
                }
                else if (currFlags & flag) {
                    error(Diagnostics.Duplicate_regular_expression_flag, pos, size);
                }
                else if (!(flag & RegularExpressionFlags.Modifiers)) {
                    error(Diagnostics.This_regular_expression_flag_cannot_be_toggled_within_a_subpattern, pos, size);
                }
                else {
                    currFlags |= flag;
                    checkRegularExpressionFlagAvailability(flag, size);
                }
                pos += size;
            }
            return currFlags;
        }

        // AtomEscape ::=
        //     | DecimalEscape
        //     | CharacterClassEscape
        //     | CharacterEscape
        //     | 'k<' RegExpIdentifierName '>'
        function scanAtomEscape() {
            Debug.assertEqual(charCodeUnchecked(pos - 1), CharacterCodes.backslash);
            switch (charCodeChecked(pos)) {
                case CharacterCodes.k:
                    pos++;
                    if (charCodeChecked(pos) === CharacterCodes.lessThan) {
                        pos++;
                        scanGroupName(/*isReference*/ true);
                        scanExpectedChar(CharacterCodes.greaterThan);
                    }
                    else if (anyUnicodeModeOrNonAnnexB || namedCaptureGroups) {
                        error(Diagnostics.k_must_be_followed_by_a_capturing_group_name_enclosed_in_angle_brackets, pos - 2, 2);
                    }
                    break;
                case CharacterCodes.q:
                    if (unicodeSetsMode) {
                        pos++;
                        error(Diagnostics.q_is_only_available_inside_character_class, pos - 2, 2);
                        break;
                    }
                // falls through
                default:
                    // The scanEscapeSequence call in scanCharacterEscape must return non-empty strings
                    // since there must not be line breaks in a regex literal
                    Debug.assert(scanCharacterClassEscape() || scanDecimalEscape() || scanCharacterEscape(/*atomEscape*/ true));
                    break;
            }
        }

        // DecimalEscape ::= [1-9] [0-9]*
        function scanDecimalEscape(): boolean {
            Debug.assertEqual(charCodeUnchecked(pos - 1), CharacterCodes.backslash);
            const ch = charCodeChecked(pos);
            if (ch >= CharacterCodes._1 && ch <= CharacterCodes._9) {
                const start = pos;
                scanDigits();
                decimalEscapes = append(decimalEscapes, { pos: start, end: pos, value: +tokenValue });
                return true;
            }
            return false;
        }

        // CharacterEscape ::=
        //     | `c` ControlLetter
        //     | IdentityEscape
        //     | (Other sequences handled by `scanEscapeSequence`)
        // IdentityEscape ::=
        //     | '^' | '$' | '/' | '\' | '.' | '*' | '+' | '?' | '(' | ')' | '[' | ']' | '{' | '}' | '|'
        //     | [~UnicodeMode] (any other non-identifier characters)
        function scanCharacterEscape(atomEscape: boolean): string {
            Debug.assertEqual(charCodeUnchecked(pos - 1), CharacterCodes.backslash);
            let ch = charCodeChecked(pos);
            switch (ch) {
                case CharacterCodes.EOF:
                    error(Diagnostics.Undetermined_character_escape, pos - 1, 1);
                    return "\\";
                case CharacterCodes.c:
                    pos++;
                    ch = charCodeChecked(pos);
                    if (isASCIILetter(ch)) {
                        pos++;
                        return String.fromCharCode(ch & 0x1f);
                    }
                    if (anyUnicodeModeOrNonAnnexB) {
                        error(Diagnostics.c_must_be_followed_by_an_ASCII_letter, pos - 2, 2);
                    }
                    else if (atomEscape) {
                        // Annex B treats
                        //
                        //  ExtendedAtom : `\` [lookahead = `c`]
                        //
                        // as the single character `\` when `c` isn't followed by a valid control character
                        pos--;
                        return "\\";
                    }
                    return String.fromCharCode(ch);
                case CharacterCodes.caret:
                case CharacterCodes.$:
                case CharacterCodes.slash:
                case CharacterCodes.backslash:
                case CharacterCodes.dot:
                case CharacterCodes.asterisk:
                case CharacterCodes.plus:
                case CharacterCodes.question:
                case CharacterCodes.openParen:
                case CharacterCodes.closeParen:
                case CharacterCodes.openBracket:
                case CharacterCodes.closeBracket:
                case CharacterCodes.openBrace:
                case CharacterCodes.closeBrace:
                case CharacterCodes.bar:
                    pos++;
                    return String.fromCharCode(ch);
                default:
                    pos--;
                    return scanEscapeSequence(
                        EscapeSequenceScanningFlags.RegularExpression
                            | (annexB ? EscapeSequenceScanningFlags.AnnexB : 0)
                            | (anyUnicodeMode ? EscapeSequenceScanningFlags.AnyUnicodeMode : 0)
                            | (atomEscape ? EscapeSequenceScanningFlags.AtomEscape : 0),
                    );
            }
        }

        function scanGroupName(isReference: boolean) {
            Debug.assertEqual(charCodeUnchecked(pos - 1), CharacterCodes.lessThan);
            tokenStart = pos;
            scanIdentifier(codePointChecked(pos), languageVersion);
            if (pos === tokenStart) {
                error(Diagnostics.Expected_a_capturing_group_name);
            }
            else if (isReference) {
                groupNameReferences = append(groupNameReferences, { pos: tokenStart, end: pos, name: tokenValue });
            }
            else if (topNamedCapturingGroupsScope?.has(tokenValue) || namedCapturingGroupsScopeStack.some(group => group?.has(tokenValue))) {
                error(Diagnostics.Named_capturing_groups_with_the_same_name_must_be_mutually_exclusive_to_each_other, tokenStart, pos - tokenStart);
            }
            else {
                topNamedCapturingGroupsScope ??= new Set();
                topNamedCapturingGroupsScope.add(tokenValue);
                groupSpecifiers ??= new Set();
                groupSpecifiers.add(tokenValue);
            }
        }

        function isClassContentExit(ch: number) {
            return ch === CharacterCodes.closeBracket || ch === CharacterCodes.EOF || pos >= end;
        }

        // ClassRanges ::= '^'? (ClassAtom ('-' ClassAtom)?)*
        function scanClassRanges() {
            Debug.assertEqual(charCodeUnchecked(pos - 1), CharacterCodes.openBracket);
            if (charCodeChecked(pos) === CharacterCodes.caret) {
                // character complement
                pos++;
            }
            while (true) {
                const ch = charCodeChecked(pos);
                if (isClassContentExit(ch)) {
                    return;
                }
                const minStart = pos;
                const minCharacter = scanClassAtom();
                if (charCodeChecked(pos) === CharacterCodes.minus) {
                    pos++;
                    const ch = charCodeChecked(pos);
                    if (isClassContentExit(ch)) {
                        return;
                    }
                    if (!minCharacter && anyUnicodeModeOrNonAnnexB) {
                        error(Diagnostics.A_character_class_range_must_not_be_bounded_by_another_character_class, minStart, pos - 1 - minStart);
                    }
                    const maxStart = pos;
                    const maxCharacter = scanClassAtom();
                    if (!maxCharacter && anyUnicodeModeOrNonAnnexB) {
                        error(Diagnostics.A_character_class_range_must_not_be_bounded_by_another_character_class, maxStart, pos - maxStart);
                        continue;
                    }
                    if (!minCharacter) {
                        continue;
                    }
                    const minCharacterValue = codePointAt(minCharacter, 0);
                    const maxCharacterValue = codePointAt(maxCharacter, 0);
                    if (
                        minCharacter.length === charSize(minCharacterValue) &&
                        maxCharacter.length === charSize(maxCharacterValue) &&
                        minCharacterValue > maxCharacterValue
                    ) {
                        error(Diagnostics.Range_out_of_order_in_character_class, minStart, pos - minStart);
                    }
                }
            }
        }

        // Static Semantics: MayContainStrings
        //     ClassUnion: ClassSetOperands.some(ClassSetOperand => ClassSetOperand.MayContainStrings)
        //     ClassIntersection: ClassSetOperands.every(ClassSetOperand => ClassSetOperand.MayContainStrings)
        //     ClassSubtraction: ClassSetOperands[0].MayContainStrings
        //     ClassSetOperand:
        //         || ClassStringDisjunctionContents.MayContainStrings
        //         || CharacterClassEscape.UnicodePropertyValueExpression.LoneUnicodePropertyNameOrValue.MayContainStrings
        //     ClassStringDisjunctionContents: ClassStrings.some(ClassString => ClassString.ClassSetCharacters.length !== 1)
        //     LoneUnicodePropertyNameOrValue: isBinaryUnicodePropertyOfStrings(LoneUnicodePropertyNameOrValue)

        // ClassSetExpression ::= '^'? (ClassUnion | ClassIntersection | ClassSubtraction)
        // ClassUnion ::= (ClassSetRange | ClassSetOperand)*
        // ClassIntersection ::= ClassSetOperand ('&&' ClassSetOperand)+
        // ClassSubtraction ::= ClassSetOperand ('--' ClassSetOperand)+
        // ClassSetRange ::= ClassSetCharacter '-' ClassSetCharacter
        function scanClassSetExpression() {
            Debug.assertEqual(charCodeUnchecked(pos - 1), CharacterCodes.openBracket);
            let isCharacterComplement = false;
            if (charCodeChecked(pos) === CharacterCodes.caret) {
                pos++;
                isCharacterComplement = true;
            }
            let expressionMayContainStrings = false;
            let ch = charCodeChecked(pos);
            if (isClassContentExit(ch)) {
                return;
            }
            let start = pos;
            let operand!: string;
            switch (text.slice(pos, pos + 2)) { // TODO: don't use slice
                case "--":
                case "&&":
                    error(Diagnostics.Expected_a_class_set_operand);
                    mayContainStrings = false;
                    break;
                default:
                    operand = scanClassSetOperand();
                    break;
            }
            switch (charCodeChecked(pos)) {
                case CharacterCodes.minus:
                    if (charCodeChecked(pos + 1) === CharacterCodes.minus) {
                        if (isCharacterComplement && mayContainStrings) {
                            error(Diagnostics.Anything_that_would_possibly_match_more_than_a_single_character_is_invalid_inside_a_negated_character_class, start, pos - start);
                        }
                        expressionMayContainStrings = mayContainStrings;
                        scanClassSetSubExpression(ClassSetExpressionType.ClassSubtraction);
                        mayContainStrings = !isCharacterComplement && expressionMayContainStrings;
                        return;
                    }
                    break;
                case CharacterCodes.ampersand:
                    if (charCodeChecked(pos + 1) === CharacterCodes.ampersand) {
                        scanClassSetSubExpression(ClassSetExpressionType.ClassIntersection);
                        if (isCharacterComplement && mayContainStrings) {
                            error(Diagnostics.Anything_that_would_possibly_match_more_than_a_single_character_is_invalid_inside_a_negated_character_class, start, pos - start);
                        }
                        expressionMayContainStrings = mayContainStrings;
                        mayContainStrings = !isCharacterComplement && expressionMayContainStrings;
                        return;
                    }
                    else {
                        error(Diagnostics.Unexpected_0_Did_you_mean_to_escape_it_with_backslash, pos, 1, String.fromCharCode(ch));
                    }
                    break;
                default:
                    if (isCharacterComplement && mayContainStrings) {
                        error(Diagnostics.Anything_that_would_possibly_match_more_than_a_single_character_is_invalid_inside_a_negated_character_class, start, pos - start);
                    }
                    expressionMayContainStrings = mayContainStrings;
                    break;
            }
            while (true) {
                ch = charCodeChecked(pos);
                if (ch === CharacterCodes.EOF) {
                    break;
                }
                switch (ch) {
                    case CharacterCodes.minus:
                        pos++;
                        ch = charCodeChecked(pos);
                        if (isClassContentExit(ch)) {
                            mayContainStrings = !isCharacterComplement && expressionMayContainStrings;
                            return;
                        }
                        if (ch === CharacterCodes.minus) {
                            pos++;
                            error(Diagnostics.Operators_must_not_be_mixed_within_a_character_class_Wrap_it_in_a_nested_class_instead, pos - 2, 2);
                            start = pos - 2;
                            operand = text.slice(start, pos);
                            continue;
                        }
                        else {
                            if (!operand) {
                                error(Diagnostics.A_character_class_range_must_not_be_bounded_by_another_character_class, start, pos - 1 - start);
                            }
                            const secondStart = pos;
                            const secondOperand = scanClassSetOperand();
                            if (isCharacterComplement && mayContainStrings) {
                                error(Diagnostics.Anything_that_would_possibly_match_more_than_a_single_character_is_invalid_inside_a_negated_character_class, secondStart, pos - secondStart);
                            }
                            expressionMayContainStrings ||= mayContainStrings;
                            if (!secondOperand) {
                                error(Diagnostics.A_character_class_range_must_not_be_bounded_by_another_character_class, secondStart, pos - secondStart);
                                break;
                            }
                            if (!operand) {
                                break;
                            }
                            const minCharacterValue = codePointAt(operand, 0);
                            const maxCharacterValue = codePointAt(secondOperand, 0);
                            if (
                                operand.length === charSize(minCharacterValue) &&
                                secondOperand.length === charSize(maxCharacterValue) &&
                                minCharacterValue > maxCharacterValue
                            ) {
                                error(Diagnostics.Range_out_of_order_in_character_class, start, pos - start);
                            }
                        }
                        break;
                    case CharacterCodes.ampersand:
                        start = pos;
                        pos++;
                        if (charCodeChecked(pos) === CharacterCodes.ampersand) {
                            pos++;
                            error(Diagnostics.Operators_must_not_be_mixed_within_a_character_class_Wrap_it_in_a_nested_class_instead, pos - 2, 2);
                            if (charCodeChecked(pos) === CharacterCodes.ampersand) {
                                error(Diagnostics.Unexpected_0_Did_you_mean_to_escape_it_with_backslash, pos, 1, String.fromCharCode(ch));
                                pos++;
                            }
                        }
                        else {
                            error(Diagnostics.Unexpected_0_Did_you_mean_to_escape_it_with_backslash, pos - 1, 1, String.fromCharCode(ch));
                        }
                        operand = text.slice(start, pos);
                        continue;
                }
                if (isClassContentExit(charCodeChecked(pos))) {
                    break;
                }
                start = pos;
                switch (text.slice(pos, pos + 2)) { // TODO: don't use slice
                    case "--":
                    case "&&":
                        error(Diagnostics.Operators_must_not_be_mixed_within_a_character_class_Wrap_it_in_a_nested_class_instead, pos, 2);
                        pos += 2;
                        operand = text.slice(start, pos);
                        break;
                    default:
                        operand = scanClassSetOperand();
                        break;
                }
            }
            mayContainStrings = !isCharacterComplement && expressionMayContainStrings;
        }

        function scanClassSetSubExpression(expressionType: ClassSetExpressionType) {
            let expressionMayContainStrings = mayContainStrings;
            while (true) {
                let ch = charCodeChecked(pos);
                if (isClassContentExit(ch)) {
                    break;
                }
                // Provide user-friendly diagnostic messages
                switch (ch) {
                    case CharacterCodes.minus:
                        pos++;
                        if (charCodeChecked(pos) === CharacterCodes.minus) {
                            pos++;
                            if (expressionType !== ClassSetExpressionType.ClassSubtraction) {
                                error(Diagnostics.Operators_must_not_be_mixed_within_a_character_class_Wrap_it_in_a_nested_class_instead, pos - 2, 2);
                            }
                        }
                        else {
                            error(Diagnostics.Operators_must_not_be_mixed_within_a_character_class_Wrap_it_in_a_nested_class_instead, pos - 1, 1);
                        }
                        break;
                    case CharacterCodes.ampersand:
                        pos++;
                        if (charCodeChecked(pos) === CharacterCodes.ampersand) {
                            pos++;
                            if (expressionType !== ClassSetExpressionType.ClassIntersection) {
                                error(Diagnostics.Operators_must_not_be_mixed_within_a_character_class_Wrap_it_in_a_nested_class_instead, pos - 2, 2);
                            }
                            if (charCodeChecked(pos) === CharacterCodes.ampersand) {
                                error(Diagnostics.Unexpected_0_Did_you_mean_to_escape_it_with_backslash, pos, 1, String.fromCharCode(ch));
                                pos++;
                            }
                        }
                        else {
                            error(Diagnostics.Unexpected_0_Did_you_mean_to_escape_it_with_backslash, pos - 1, 1, String.fromCharCode(ch));
                        }
                        break;
                    default:
                        switch (expressionType) {
                            case ClassSetExpressionType.ClassSubtraction:
                                error(Diagnostics._0_expected, pos, 0, "--");
                                break;
                            case ClassSetExpressionType.ClassIntersection:
                                error(Diagnostics._0_expected, pos, 0, "&&");
                                break;
                            default:
                                break;
                        }
                        break;
                }
                ch = charCodeChecked(pos);
                if (isClassContentExit(ch)) {
                    error(Diagnostics.Expected_a_class_set_operand);
                    break;
                }
                scanClassSetOperand();
                // Used only if expressionType is Intersection
                expressionMayContainStrings &&= mayContainStrings;
            }
            mayContainStrings = expressionMayContainStrings;
        }

        // ClassSetOperand ::=
        //     | '[' ClassSetExpression ']'
        //     | '\' CharacterClassEscape
        //     | '\q{' ClassStringDisjunctionContents '}'
        //     | ClassSetCharacter
        function scanClassSetOperand(): string {
            mayContainStrings = false;
            switch (charCodeChecked(pos)) {
                case CharacterCodes.EOF:
                    return "";
                case CharacterCodes.openBracket:
                    pos++;
                    scanClassSetExpression();
                    scanExpectedChar(CharacterCodes.closeBracket);
                    return "";
                case CharacterCodes.backslash:
                    pos++;
                    if (scanCharacterClassEscape()) {
                        return "";
                    }
                    else if (charCodeChecked(pos) === CharacterCodes.q) {
                        pos++;
                        if (charCodeChecked(pos) === CharacterCodes.openBrace) {
                            pos++;
                            scanClassStringDisjunctionContents();
                            scanExpectedChar(CharacterCodes.closeBrace);
                            return "";
                        }
                        else {
                            error(Diagnostics.q_must_be_followed_by_string_alternatives_enclosed_in_braces, pos - 2, 2);
                            return "q";
                        }
                    }
                    pos--;
                // falls through
                default:
                    return scanClassSetCharacter();
            }
        }

        // ClassStringDisjunctionContents ::= ClassSetCharacter* ('|' ClassSetCharacter*)*
        function scanClassStringDisjunctionContents() {
            Debug.assertEqual(charCodeUnchecked(pos - 1), CharacterCodes.openBrace);
            let characterCount = 0;
            while (true) {
                const ch = charCodeChecked(pos);
                switch (ch) {
                    case CharacterCodes.EOF:
                        return;
                    case CharacterCodes.closeBrace:
                        if (characterCount !== 1) {
                            mayContainStrings = true;
                        }
                        return;
                    case CharacterCodes.bar:
                        if (characterCount !== 1) {
                            mayContainStrings = true;
                        }
                        pos++;
                        start = pos;
                        characterCount = 0;
                        break;
                    default:
                        scanClassSetCharacter();
                        characterCount++;
                        break;
                }
            }
        }

        // ClassSetCharacter ::=
        //     | SourceCharacter -- ClassSetSyntaxCharacter -- ClassSetReservedDoublePunctuator
        //     | '\' (CharacterEscape | ClassSetReservedPunctuator | 'b')
        function scanClassSetCharacter(): string {
            const ch = charCodeChecked(pos);
            if (ch === CharacterCodes.EOF) {
                // no need to report an error, the initial scan will already have reported that the RegExp is unterminated.
                return "";
            }
            if (ch === CharacterCodes.backslash) {
                pos++;
                const ch = charCodeChecked(pos);
                switch (ch) {
                    case CharacterCodes.b:
                        pos++;
                        return "\b";
                    case CharacterCodes.ampersand:
                    case CharacterCodes.minus:
                    case CharacterCodes.exclamation:
                    case CharacterCodes.hash:
                    case CharacterCodes.percent:
                    case CharacterCodes.comma:
                    case CharacterCodes.colon:
                    case CharacterCodes.semicolon:
                    case CharacterCodes.lessThan:
                    case CharacterCodes.equals:
                    case CharacterCodes.greaterThan:
                    case CharacterCodes.at:
                    case CharacterCodes.backtick:
                    case CharacterCodes.tilde:
                        pos++;
                        return String.fromCharCode(ch);
                    default:
                        return scanCharacterEscape(/*atomEscape*/ false);
                }
            }
            else if (ch === charCodeChecked(pos + 1)) {
                switch (ch) {
                    case CharacterCodes.ampersand:
                    case CharacterCodes.exclamation:
                    case CharacterCodes.hash:
                    case CharacterCodes.percent:
                    case CharacterCodes.asterisk:
                    case CharacterCodes.plus:
                    case CharacterCodes.comma:
                    case CharacterCodes.dot:
                    case CharacterCodes.colon:
                    case CharacterCodes.semicolon:
                    case CharacterCodes.lessThan:
                    case CharacterCodes.equals:
                    case CharacterCodes.greaterThan:
                    case CharacterCodes.question:
                    case CharacterCodes.at:
                    case CharacterCodes.backtick:
                    case CharacterCodes.tilde:
                        error(Diagnostics.A_character_class_must_not_contain_a_reserved_double_punctuator_Did_you_mean_to_escape_it_with_backslash, pos, 2);
                        pos += 2;
                        return text.substring(pos - 2, pos);
                }
            }
            switch (ch) {
                case CharacterCodes.slash:
                case CharacterCodes.openParen:
                case CharacterCodes.closeParen:
                case CharacterCodes.openBracket:
                case CharacterCodes.closeBracket:
                case CharacterCodes.openBrace:
                case CharacterCodes.closeBrace:
                case CharacterCodes.minus:
                case CharacterCodes.bar:
                    error(Diagnostics.Unexpected_0_Did_you_mean_to_escape_it_with_backslash, pos, 1, String.fromCharCode(ch));
                    pos++;
                    return String.fromCharCode(ch);
            }
            return scanSourceCharacter();
        }

        // ClassAtom ::=
        //     | SourceCharacter but not one of '\' or ']'
        //     | '\' ClassEscape
        // ClassEscape ::=
        //     | 'b'
        //     | '-'
        //     | CharacterClassEscape
        //     | CharacterEscape
        function scanClassAtom(): string {
            if (charCodeChecked(pos) === CharacterCodes.backslash) {
                pos++;
                const ch = charCodeChecked(pos);
                switch (ch) {
                    case CharacterCodes.b:
                        pos++;
                        return "\b";
                    case CharacterCodes.minus:
                        pos++;
                        return String.fromCharCode(ch);
                    default:
                        if (scanCharacterClassEscape()) {
                            return "";
                        }
                        return scanCharacterEscape(/*atomEscape*/ false);
                }
            }
            else {
                return scanSourceCharacter();
            }
        }

        // CharacterClassEscape ::=
        //     | 'd' | 'D' | 's' | 'S' | 'w' | 'W'
        //     | [+UnicodeMode] ('P' | 'p') '{' UnicodePropertyValueExpression '}'
        function scanCharacterClassEscape(): boolean {
            Debug.assertEqual(charCodeUnchecked(pos - 1), CharacterCodes.backslash);
            let isCharacterComplement = false;
            const start = pos - 1;
            const ch = charCodeChecked(pos);
            switch (ch) {
                case CharacterCodes.d:
                case CharacterCodes.D:
                case CharacterCodes.s:
                case CharacterCodes.S:
                case CharacterCodes.w:
                case CharacterCodes.W:
                    pos++;
                    return true;
                case CharacterCodes.P:
                    isCharacterComplement = true;
                // falls through
                case CharacterCodes.p:
                    pos++;
                    if (charCodeChecked(pos) === CharacterCodes.openBrace) {
                        pos++;
                        const propertyNameOrValueStart = pos;
                        const propertyNameOrValue = scanWordCharacters();
                        if (charCodeChecked(pos) === CharacterCodes.equals) {
                            const propertyName = nonBinaryUnicodeProperties.get(propertyNameOrValue);
                            if (pos === propertyNameOrValueStart) {
                                error(Diagnostics.Expected_a_Unicode_property_name);
                            }
                            else if (propertyName === undefined) {
                                error(Diagnostics.Unknown_Unicode_property_name, propertyNameOrValueStart, pos - propertyNameOrValueStart);
                                const suggestion = getSpellingSuggestion(propertyNameOrValue, nonBinaryUnicodeProperties.keys(), identity);
                                if (suggestion) {
                                    error(Diagnostics.Did_you_mean_0, propertyNameOrValueStart, pos - propertyNameOrValueStart, suggestion);
                                }
                            }
                            pos++;
                            const propertyValueStart = pos;
                            const propertyValue = scanWordCharacters();
                            if (pos === propertyValueStart) {
                                error(Diagnostics.Expected_a_Unicode_property_value);
                            }
                            else if (propertyName !== undefined && !valuesOfNonBinaryUnicodeProperties[propertyName].has(propertyValue)) {
                                error(Diagnostics.Unknown_Unicode_property_value, propertyValueStart, pos - propertyValueStart);
                                const suggestion = getSpellingSuggestion(propertyValue, valuesOfNonBinaryUnicodeProperties[propertyName], identity);
                                if (suggestion) {
                                    error(Diagnostics.Did_you_mean_0, propertyValueStart, pos - propertyValueStart, suggestion);
                                }
                            }
                        }
                        else {
                            if (pos === propertyNameOrValueStart) {
                                error(Diagnostics.Expected_a_Unicode_property_name_or_value);
                            }
                            else if (binaryUnicodePropertiesOfStrings.has(propertyNameOrValue)) {
                                if (!unicodeSetsMode) {
                                    error(Diagnostics.Any_Unicode_property_that_would_possibly_match_more_than_a_single_character_is_only_available_when_the_Unicode_Sets_v_flag_is_set, propertyNameOrValueStart, pos - propertyNameOrValueStart);
                                }
                                else if (isCharacterComplement) {
                                    error(Diagnostics.Anything_that_would_possibly_match_more_than_a_single_character_is_invalid_inside_a_negated_character_class, propertyNameOrValueStart, pos - propertyNameOrValueStart);
                                }
                                else {
                                    mayContainStrings = true;
                                }
                            }
                            else if (!valuesOfNonBinaryUnicodeProperties.General_Category.has(propertyNameOrValue) && !binaryUnicodeProperties.has(propertyNameOrValue)) {
                                error(Diagnostics.Unknown_Unicode_property_name_or_value, propertyNameOrValueStart, pos - propertyNameOrValueStart);
                                const suggestion = getSpellingSuggestion(propertyNameOrValue, [...valuesOfNonBinaryUnicodeProperties.General_Category, ...binaryUnicodeProperties, ...binaryUnicodePropertiesOfStrings], identity);
                                if (suggestion) {
                                    error(Diagnostics.Did_you_mean_0, propertyNameOrValueStart, pos - propertyNameOrValueStart, suggestion);
                                }
                            }
                        }
                        scanExpectedChar(CharacterCodes.closeBrace);
                        if (!anyUnicodeMode) {
                            error(Diagnostics.Unicode_property_value_expressions_are_only_available_when_the_Unicode_u_flag_or_the_Unicode_Sets_v_flag_is_set, start, pos - start);
                        }
                    }
                    else if (anyUnicodeModeOrNonAnnexB) {
                        error(Diagnostics._0_must_be_followed_by_a_Unicode_property_value_expression_enclosed_in_braces, pos - 2, 2, String.fromCharCode(ch));
                    }
                    else {
                        pos--;
                        return false;
                    }
                    return true;
            }
            return false;
        }

        function scanWordCharacters(): string {
            let value = "";
            while (true) {
                const ch = charCodeChecked(pos);
                if (ch === CharacterCodes.EOF || !isWordCharacter(ch)) {
                    break;
                }
                value += String.fromCharCode(ch);
                pos++;
            }
            return value;
        }

        function scanSourceCharacter(): string {
            const size = anyUnicodeMode ? charSize(charCodeChecked(pos)) : 1;
            pos += size;
            return size > 0 ? text.substring(pos - size, pos) : "";
        }

        function scanExpectedChar(ch: CharacterCodes) {
            if (charCodeChecked(pos) === ch) {
                pos++;
            }
            else {
                error(Diagnostics._0_expected, pos, 0, String.fromCharCode(ch));
            }
        }

        scanDisjunction(/*isInGroup*/ false);

        forEach(groupNameReferences, reference => {
            if (!groupSpecifiers?.has(reference.name)) {
                error(Diagnostics.There_is_no_capturing_group_named_0_in_this_regular_expression, reference.pos, reference.end - reference.pos, reference.name);
                if (groupSpecifiers) {
                    const suggestion = getSpellingSuggestion(reference.name, groupSpecifiers, identity);
                    if (suggestion) {
                        error(Diagnostics.Did_you_mean_0, reference.pos, reference.end - reference.pos, suggestion);
                    }
                }
            }
        });
        forEach(decimalEscapes, escape => {
            // Although a DecimalEscape with a value greater than the number of capturing groups
            // is treated as either a LegacyOctalEscapeSequence or an IdentityEscape in Annex B,
            // an error is nevertheless reported since it's most likely a mistake.
            if (escape.value > numberOfCapturingGroups) {
                if (numberOfCapturingGroups) {
                    error(Diagnostics.This_backreference_refers_to_a_group_that_does_not_exist_There_are_only_0_capturing_groups_in_this_regular_expression, escape.pos, escape.end - escape.pos, numberOfCapturingGroups);
                }
                else {
                    error(Diagnostics.This_backreference_refers_to_a_group_that_does_not_exist_There_are_no_capturing_groups_in_this_regular_expression, escape.pos, escape.end - escape.pos);
                }
            }
        });
    }

    function checkRegularExpressionFlagAvailability(flag: RegularExpressionFlags, size: number) {
        const availableFrom = regExpFlagToFirstAvailableLanguageVersion.get(flag) as ScriptTarget | undefined;
        if (availableFrom && languageVersion < availableFrom) {
            error(Diagnostics.This_regular_expression_flag_is_only_available_when_targeting_0_or_later, pos, size, getNameOfScriptTarget(availableFrom));
        }
    }

    function appendIfCommentDirective(
        commentDirectives: CommentDirective[] | undefined,
        text: string,
        commentDirectiveRegEx: RegExp,
        lineStart: number,
    ) {
        const type = getDirectiveFromComment(text.trimStart(), commentDirectiveRegEx);
        if (type === undefined) {
            return commentDirectives;
        }

        return append(
            commentDirectives,
            {
                range: { pos: lineStart, end: pos },
                type,
            },
        );
    }

    function getDirectiveFromComment(text: string, commentDirectiveRegEx: RegExp) {
        const match = commentDirectiveRegEx.exec(text);
        if (!match) {
            return undefined;
        }

        switch (match[1]) {
            case "ts-expect-error":
                return CommentDirectiveType.ExpectError;

            case "ts-ignore":
                return CommentDirectiveType.Ignore;
        }

        return undefined;
    }

    /**
     * Unconditionally back up and scan a template expression portion.
     */
    function reScanTemplateToken(isTaggedTemplate: boolean): SyntaxKind {
        pos = tokenStart;
        return token = scanTemplateAndSetTokenValue(!isTaggedTemplate);
    }

    function reScanTemplateHeadOrNoSubstitutionTemplate(): SyntaxKind {
        pos = tokenStart;
        return token = scanTemplateAndSetTokenValue(/*shouldEmitInvalidEscapeError*/ true);
    }

    function reScanJsxToken(allowMultilineJsxText = true): JsxTokenSyntaxKind {
        pos = tokenStart = fullStartPos;
        return token = scanJsxToken(allowMultilineJsxText);
    }

    function reScanLessThanToken(): SyntaxKind {
        if (token === SyntaxKind.LessThanLessThanToken) {
            pos = tokenStart + 1;
            return token = SyntaxKind.LessThanToken;
        }
        return token;
    }

    function reScanHashToken(): SyntaxKind {
        if (token === SyntaxKind.PrivateIdentifier) {
            pos = tokenStart + 1;
            return token = SyntaxKind.HashToken;
        }
        return token;
    }

    function reScanQuestionToken(): SyntaxKind {
        Debug.assert(token === SyntaxKind.QuestionQuestionToken, "'reScanQuestionToken' should only be called on a '??'");
        pos = tokenStart + 1;
        return token = SyntaxKind.QuestionToken;
    }

    function scanJsxToken(allowMultilineJsxText = true): JsxTokenSyntaxKind {
        fullStartPos = tokenStart = pos;

        if (pos >= end) {
            return token = SyntaxKind.EndOfFileToken;
        }

        let char = charCodeUnchecked(pos);
        if (char === CharacterCodes.lessThan) {
            if (charCodeUnchecked(pos + 1) === CharacterCodes.slash) {
                pos += 2;
                return token = SyntaxKind.LessThanSlashToken;
            }
            pos++;
            return token = SyntaxKind.LessThanToken;
        }

        if (char === CharacterCodes.openBrace) {
            pos++;
            return token = SyntaxKind.OpenBraceToken;
        }

        // First non-whitespace character on this line.
        let firstNonWhitespace = 0;

        // These initial values are special because the first line is:
        // firstNonWhitespace = 0 to indicate that we want leading whitespace,

        while (pos < end) {
            char = charCodeUnchecked(pos);
            if (char === CharacterCodes.openBrace) {
                break;
            }
            if (char === CharacterCodes.lessThan) {
                if (isConflictMarkerTrivia(text, pos)) {
                    pos = scanConflictMarkerTrivia(text, pos, error);
                    return token = SyntaxKind.ConflictMarkerTrivia;
                }
                break;
            }
            if (char === CharacterCodes.greaterThan) {
                error(Diagnostics.Unexpected_token_Did_you_mean_or_gt, pos, 1);
            }
            if (char === CharacterCodes.closeBrace) {
                error(Diagnostics.Unexpected_token_Did_you_mean_or_rbrace, pos, 1);
            }

            // FirstNonWhitespace is 0, then we only see whitespaces so far. If we see a linebreak, we want to ignore that whitespaces.
            // i.e (- : whitespace)
            //      <div>----
            //      </div> becomes <div></div>
            //
            //      <div>----</div> becomes <div>----</div>
            if (isLineBreak(char) && firstNonWhitespace === 0) {
                firstNonWhitespace = -1;
            }
            else if (!allowMultilineJsxText && isLineBreak(char) && firstNonWhitespace > 0) {
                // Stop JsxText on each line during formatting. This allows the formatter to
                // indent each line correctly.
                break;
            }
            else if (!isWhiteSpaceLike(char)) {
                firstNonWhitespace = pos;
            }

            pos++;
        }

        tokenValue = text.substring(fullStartPos, pos);

        return firstNonWhitespace === -1 ? SyntaxKind.JsxTextAllWhiteSpaces : SyntaxKind.JsxText;
    }

    // Scans a JSX identifier; these differ from normal identifiers in that
    // they allow dashes
    function scanJsxIdentifier(): SyntaxKind {
        if (tokenIsIdentifierOrKeyword(token)) {
            // An identifier or keyword has already been parsed - check for a `-` or a single instance of `:` and then append it and
            // everything after it to the token
            // Do note that this means that `scanJsxIdentifier` effectively _mutates_ the visible token without advancing to a new token
            // Any caller should be expecting this behavior and should only read the pos or token value after calling it.
            while (pos < end) {
                const ch = charCodeUnchecked(pos);
                if (ch === CharacterCodes.minus) {
                    tokenValue += "-";
                    pos++;
                    continue;
                }
                const oldPos = pos;
                tokenValue += scanIdentifierParts(); // reuse `scanIdentifierParts` so unicode escapes are handled
                if (pos === oldPos) {
                    break;
                }
            }
            return getIdentifierToken();
        }
        return token;
    }

    function scanJsxAttributeValue(): SyntaxKind {
        fullStartPos = pos;

        switch (charCodeUnchecked(pos)) {
            case CharacterCodes.doubleQuote:
            case CharacterCodes.singleQuote:
                tokenValue = scanString(/*jsxAttributeString*/ true);
                return token = SyntaxKind.StringLiteral;
            default:
                // If this scans anything other than `{`, it's a parse error.
                return scan();
        }
    }

    function reScanJsxAttributeValue(): SyntaxKind {
        pos = tokenStart = fullStartPos;
        return scanJsxAttributeValue();
    }

    function scanJSDocCommentTextToken(inBackticks: boolean): JSDocSyntaxKind | SyntaxKind.JSDocCommentTextToken {
        fullStartPos = tokenStart = pos;
        tokenFlags = TokenFlags.None;
        if (pos >= end) {
            return token = SyntaxKind.EndOfFileToken;
        }
        for (let ch = charCodeUnchecked(pos); pos < end && (!isLineBreak(ch) && ch !== CharacterCodes.backtick); ch = codePointUnchecked(++pos)) {
            if (!inBackticks) {
                if (ch === CharacterCodes.openBrace) {
                    break;
                }
                else if (
                    ch === CharacterCodes.at
                    && pos - 1 >= 0 && isWhiteSpaceSingleLine(charCodeUnchecked(pos - 1))
                    && !(pos + 1 < end && isWhiteSpaceLike(charCodeUnchecked(pos + 1)))
                ) {
                    // @ doesn't start a new tag inside ``, and elsewhere, only after whitespace and before non-whitespace
                    break;
                }
            }
        }
        if (pos === tokenStart) {
            return scanJsDocToken();
        }
        tokenValue = text.substring(tokenStart, pos);
        return token = SyntaxKind.JSDocCommentTextToken;
    }

    function scanJsDocToken(): JSDocSyntaxKind {
        fullStartPos = tokenStart = pos;
        tokenFlags = TokenFlags.None;
        if (pos >= end) {
            return token = SyntaxKind.EndOfFileToken;
        }

        const ch = codePointUnchecked(pos);
        pos += charSize(ch);
        switch (ch) {
            case CharacterCodes.tab:
            case CharacterCodes.verticalTab:
            case CharacterCodes.formFeed:
            case CharacterCodes.space:
                while (pos < end && isWhiteSpaceSingleLine(charCodeUnchecked(pos))) {
                    pos++;
                }
                return token = SyntaxKind.WhitespaceTrivia;
            case CharacterCodes.at:
                return token = SyntaxKind.AtToken;
            case CharacterCodes.carriageReturn:
                if (charCodeUnchecked(pos) === CharacterCodes.lineFeed) {
                    pos++;
                }
                // falls through
            case CharacterCodes.lineFeed:
                tokenFlags |= TokenFlags.PrecedingLineBreak;
                return token = SyntaxKind.NewLineTrivia;
            case CharacterCodes.asterisk:
                return token = SyntaxKind.AsteriskToken;
            case CharacterCodes.openBrace:
                return token = SyntaxKind.OpenBraceToken;
            case CharacterCodes.closeBrace:
                return token = SyntaxKind.CloseBraceToken;
            case CharacterCodes.openBracket:
                return token = SyntaxKind.OpenBracketToken;
            case CharacterCodes.closeBracket:
                return token = SyntaxKind.CloseBracketToken;
            case CharacterCodes.openParen:
                return token = SyntaxKind.OpenParenToken;
            case CharacterCodes.closeParen:
                return token = SyntaxKind.CloseParenToken;
            case CharacterCodes.lessThan:
                return token = SyntaxKind.LessThanToken;
            case CharacterCodes.greaterThan:
                return token = SyntaxKind.GreaterThanToken;
            case CharacterCodes.equals:
                return token = SyntaxKind.EqualsToken;
            case CharacterCodes.comma:
                return token = SyntaxKind.CommaToken;
            case CharacterCodes.dot:
                return token = SyntaxKind.DotToken;
            case CharacterCodes.backtick:
                return token = SyntaxKind.BacktickToken;
            case CharacterCodes.hash:
                return token = SyntaxKind.HashToken;
            case CharacterCodes.backslash:
                pos--;
                const extendedCookedChar = peekExtendedUnicodeEscape();
                if (extendedCookedChar >= 0 && isIdentifierStart(extendedCookedChar, languageVersion)) {
                    tokenValue = scanExtendedUnicodeEscape(/*shouldEmitInvalidEscapeError*/ true) + scanIdentifierParts();
                    return token = getIdentifierToken();
                }

                const cookedChar = peekUnicodeEscape();
                if (cookedChar >= 0 && isIdentifierStart(cookedChar, languageVersion)) {
                    pos += 6;
                    tokenFlags |= TokenFlags.UnicodeEscape;
                    tokenValue = String.fromCharCode(cookedChar) + scanIdentifierParts();
                    return token = getIdentifierToken();
                }
                pos++;
                return token = SyntaxKind.Unknown;
        }

        if (isIdentifierStart(ch, languageVersion)) {
            let char = ch;
            while (pos < end && isIdentifierPart(char = codePointUnchecked(pos), languageVersion) || char === CharacterCodes.minus) pos += charSize(char);
            tokenValue = text.substring(tokenStart, pos);
            if (char === CharacterCodes.backslash) {
                tokenValue += scanIdentifierParts();
            }
            return token = getIdentifierToken();
        }
        else {
            return token = SyntaxKind.Unknown;
        }
    }

    function speculationHelper<T>(callback: () => T, isLookahead: boolean): T {
        const savePos = pos;
        const saveStartPos = fullStartPos;
        const saveTokenPos = tokenStart;
        const saveToken = token;
        const saveTokenValue = tokenValue;
        const saveTokenFlags = tokenFlags;
        const result = callback();

        // If our callback returned something 'falsy' or we're just looking ahead,
        // then unconditionally restore us to where we were.
        if (!result || isLookahead) {
            pos = savePos;
            fullStartPos = saveStartPos;
            tokenStart = saveTokenPos;
            token = saveToken;
            tokenValue = saveTokenValue;
            tokenFlags = saveTokenFlags;
        }
        return result;
    }

    function scanRange<T>(start: number, length: number, callback: () => T): T {
        const saveEnd = end;
        const savePos = pos;
        const saveStartPos = fullStartPos;
        const saveTokenPos = tokenStart;
        const saveToken = token;
        const saveTokenValue = tokenValue;
        const saveTokenFlags = tokenFlags;
        const saveErrorExpectations = commentDirectives;

        setText(text, start, length);
        const result = callback();

        end = saveEnd;
        pos = savePos;
        fullStartPos = saveStartPos;
        tokenStart = saveTokenPos;
        token = saveToken;
        tokenValue = saveTokenValue;
        tokenFlags = saveTokenFlags;
        commentDirectives = saveErrorExpectations;

        return result;
    }

    function lookAhead<T>(callback: () => T): T {
        return speculationHelper(callback, /*isLookahead*/ true);
    }

    function tryScan<T>(callback: () => T): T {
        return speculationHelper(callback, /*isLookahead*/ false);
    }

    function getText(): string {
        return text;
    }

    function clearCommentDirectives() {
        commentDirectives = undefined;
    }

    function setText(newText: string | undefined, start: number | undefined, length: number | undefined) {
        text = newText || "";
        end = length === undefined ? text.length : start! + length;
        resetTokenState(start || 0);
    }

    function setOnError(errorCallback: ErrorCallback | undefined) {
        onError = errorCallback;
    }

    function setScriptTarget(scriptTarget: ScriptTarget) {
        languageVersion = scriptTarget;
    }

    function setLanguageVariant(variant: LanguageVariant) {
        languageVariant = variant;
    }

    function setScriptKind(kind: ScriptKind) {
        scriptKind = kind;
    }

    function setJSDocParsingMode(kind: JSDocParsingMode) {
        jsDocParsingMode = kind;
    }

    function resetTokenState(position: number) {
        Debug.assert(position >= 0);
        pos = position;
        fullStartPos = position;
        tokenStart = position;
        token = SyntaxKind.Unknown;
        tokenValue = undefined!;
        tokenFlags = TokenFlags.None;
    }

    function setSkipJsDocLeadingAsterisks(skip: boolean) {
        skipJsDocLeadingAsterisks += skip ? 1 : -1;
    }
}

function codePointAt(s: string, i: number): number {
    // TODO(jakebailey): this is wrong and should have ?? 0; but all users are okay with it
    return s.codePointAt(i)!;
}

function charSize(ch: number) {
    if (ch >= 0x10000) {
        return 2;
    }
    if (ch === CharacterCodes.EOF) {
        return 0;
    }
    return 1;
}

// Derived from the 10.1.1 UTF16Encoding of the ES6 Spec.
function utf16EncodeAsStringFallback(codePoint: number) {
    Debug.assert(0x0 <= codePoint && codePoint <= 0x10FFFF);

    if (codePoint <= 65535) {
        return String.fromCharCode(codePoint);
    }

    const codeUnit1 = Math.floor((codePoint - 65536) / 1024) + 0xD800;
    const codeUnit2 = ((codePoint - 65536) % 1024) + 0xDC00;

    return String.fromCharCode(codeUnit1, codeUnit2);
}

const utf16EncodeAsStringWorker: (codePoint: number) => string = (String as any).fromCodePoint ? codePoint => (String as any).fromCodePoint(codePoint) : utf16EncodeAsStringFallback;

/** @internal */
export function utf16EncodeAsString(codePoint: number) {
    return utf16EncodeAsStringWorker(codePoint);
}

// Table 66: Non-binary Unicode property aliases and their canonical property names
// https://tc39.es/ecma262/#table-nonbinary-unicode-properties
// dprint-ignore
const nonBinaryUnicodeProperties = new Map(Object.entries({
    General_Category: "General_Category",
    gc: "General_Category",
    Script: "Script",
    sc: "Script",
    Script_Extensions: "Script_Extensions",
    scx: "Script_Extensions",
} as const));

// Table 67: Binary Unicode property aliases and their canonical property names
// https://tc39.es/ecma262/#table-binary-unicode-properties
// dprint-ignore
const binaryUnicodeProperties = new Set(["ASCII", "ASCII_Hex_Digit", "AHex", "Alphabetic", "Alpha", "Any", "Assigned", "Bidi_Control", "Bidi_C", "Bidi_Mirrored", "Bidi_M", "Case_Ignorable", "CI", "Cased", "Changes_When_Casefolded", "CWCF", "Changes_When_Casemapped", "CWCM", "Changes_When_Lowercased", "CWL", "Changes_When_NFKC_Casefolded", "CWKCF", "Changes_When_Titlecased", "CWT", "Changes_When_Uppercased", "CWU", "Dash", "Default_Ignorable_Code_Point", "DI", "Deprecated", "Dep", "Diacritic", "Dia", "Emoji", "Emoji_Component", "EComp", "Emoji_Modifier", "EMod", "Emoji_Modifier_Base", "EBase", "Emoji_Presentation", "EPres", "Extended_Pictographic", "ExtPict", "Extender", "Ext", "Grapheme_Base", "Gr_Base", "Grapheme_Extend", "Gr_Ext", "Hex_Digit", "Hex", "IDS_Binary_Operator", "IDSB", "IDS_Trinary_Operator", "IDST", "ID_Continue", "IDC", "ID_Start", "IDS", "Ideographic", "Ideo", "Join_Control", "Join_C", "Logical_Order_Exception", "LOE", "Lowercase", "Lower", "Math", "Noncharacter_Code_Point", "NChar", "Pattern_Syntax", "Pat_Syn", "Pattern_White_Space", "Pat_WS", "Quotation_Mark", "QMark", "Radical", "Regional_Indicator", "RI", "Sentence_Terminal", "STerm", "Soft_Dotted", "SD", "Terminal_Punctuation", "Term", "Unified_Ideograph", "UIdeo", "Uppercase", "Upper", "Variation_Selector", "VS", "White_Space", "space", "XID_Continue", "XIDC", "XID_Start", "XIDS"]);

// Table 68: Binary Unicode properties of strings
// https://tc39.es/ecma262/#table-binary-unicode-properties-of-strings
// dprint-ignore
const binaryUnicodePropertiesOfStrings = new Set(["Basic_Emoji", "Emoji_Keycap_Sequence", "RGI_Emoji_Modifier_Sequence", "RGI_Emoji_Flag_Sequence", "RGI_Emoji_Tag_Sequence", "RGI_Emoji_ZWJ_Sequence", "RGI_Emoji"]);

// Unicode 15.1
// dprint-ignore
const valuesOfNonBinaryUnicodeProperties = {
    General_Category: new Set(["C", "Other", "Cc", "Control", "cntrl", "Cf", "Format", "Cn", "Unassigned", "Co", "Private_Use", "Cs", "Surrogate", "L", "Letter", "LC", "Cased_Letter", "Ll", "Lowercase_Letter", "Lm", "Modifier_Letter", "Lo", "Other_Letter", "Lt", "Titlecase_Letter", "Lu", "Uppercase_Letter", "M", "Mark", "Combining_Mark", "Mc", "Spacing_Mark", "Me", "Enclosing_Mark", "Mn", "Nonspacing_Mark", "N", "Number", "Nd", "Decimal_Number", "digit", "Nl", "Letter_Number", "No", "Other_Number", "P", "Punctuation", "punct", "Pc", "Connector_Punctuation", "Pd", "Dash_Punctuation", "Pe", "Close_Punctuation", "Pf", "Final_Punctuation", "Pi", "Initial_Punctuation", "Po", "Other_Punctuation", "Ps", "Open_Punctuation", "S", "Symbol", "Sc", "Currency_Symbol", "Sk", "Modifier_Symbol", "Sm", "Math_Symbol", "So", "Other_Symbol", "Z", "Separator", "Zl", "Line_Separator", "Zp", "Paragraph_Separator", "Zs", "Space_Separator"]),
    Script: new Set(["Adlm", "Adlam", "Aghb", "Caucasian_Albanian", "Ahom", "Arab", "Arabic", "Armi", "Imperial_Aramaic", "Armn", "Armenian", "Avst", "Avestan", "Bali", "Balinese", "Bamu", "Bamum", "Bass", "Bassa_Vah", "Batk", "Batak", "Beng", "Bengali", "Bhks", "Bhaiksuki", "Bopo", "Bopomofo", "Brah", "Brahmi", "Brai", "Braille", "Bugi", "Buginese", "Buhd", "Buhid", "Cakm", "Chakma", "Cans", "Canadian_Aboriginal", "Cari", "Carian", "Cham", "Cher", "Cherokee", "Chrs", "Chorasmian", "Copt", "Coptic", "Qaac", "Cpmn", "Cypro_Minoan", "Cprt", "Cypriot", "Cyrl", "Cyrillic", "Deva", "Devanagari", "Diak", "Dives_Akuru", "Dogr", "Dogra", "Dsrt", "Deseret", "Dupl", "Duployan", "Egyp", "Egyptian_Hieroglyphs", "Elba", "Elbasan", "Elym", "Elymaic", "Ethi", "Ethiopic", "Geor", "Georgian", "Glag", "Glagolitic", "Gong", "Gunjala_Gondi", "Gonm", "Masaram_Gondi", "Goth", "Gothic", "Gran", "Grantha", "Grek", "Greek", "Gujr", "Gujarati", "Guru", "Gurmukhi", "Hang", "Hangul", "Hani", "Han", "Hano", "Hanunoo", "Hatr", "Hatran", "Hebr", "Hebrew", "Hira", "Hiragana", "Hluw", "Anatolian_Hieroglyphs", "Hmng", "Pahawh_Hmong", "Hmnp", "Nyiakeng_Puachue_Hmong", "Hrkt", "Katakana_Or_Hiragana", "Hung", "Old_Hungarian", "Ital", "Old_Italic", "Java", "Javanese", "Kali", "Kayah_Li", "Kana", "Katakana", "Kawi", "Khar", "Kharoshthi", "Khmr", "Khmer", "Khoj", "Khojki", "Kits", "Khitan_Small_Script", "Knda", "Kannada", "Kthi", "Kaithi", "Lana", "Tai_Tham", "Laoo", "Lao", "Latn", "Latin", "Lepc", "Lepcha", "Limb", "Limbu", "Lina", "Linear_A", "Linb", "Linear_B", "Lisu", "Lyci", "Lycian", "Lydi", "Lydian", "Mahj", "Mahajani", "Maka", "Makasar", "Mand", "Mandaic", "Mani", "Manichaean", "Marc", "Marchen", "Medf", "Medefaidrin", "Mend", "Mende_Kikakui", "Merc", "Meroitic_Cursive", "Mero", "Meroitic_Hieroglyphs", "Mlym", "Malayalam", "Modi", "Mong", "Mongolian", "Mroo", "Mro", "Mtei", "Meetei_Mayek", "Mult", "Multani", "Mymr", "Myanmar", "Nagm", "Nag_Mundari", "Nand", "Nandinagari", "Narb", "Old_North_Arabian", "Nbat", "Nabataean", "Newa", "Nkoo", "Nko", "Nshu", "Nushu", "Ogam", "Ogham", "Olck", "Ol_Chiki", "Orkh", "Old_Turkic", "Orya", "Oriya", "Osge", "Osage", "Osma", "Osmanya", "Ougr", "Old_Uyghur", "Palm", "Palmyrene", "Pauc", "Pau_Cin_Hau", "Perm", "Old_Permic", "Phag", "Phags_Pa", "Phli", "Inscriptional_Pahlavi", "Phlp", "Psalter_Pahlavi", "Phnx", "Phoenician", "Plrd", "Miao", "Prti", "Inscriptional_Parthian", "Rjng", "Rejang", "Rohg", "Hanifi_Rohingya", "Runr", "Runic", "Samr", "Samaritan", "Sarb", "Old_South_Arabian", "Saur", "Saurashtra", "Sgnw", "SignWriting", "Shaw", "Shavian", "Shrd", "Sharada", "Sidd", "Siddham", "Sind", "Khudawadi", "Sinh", "Sinhala", "Sogd", "Sogdian", "Sogo", "Old_Sogdian", "Sora", "Sora_Sompeng", "Soyo", "Soyombo", "Sund", "Sundanese", "Sylo", "Syloti_Nagri", "Syrc", "Syriac", "Tagb", "Tagbanwa", "Takr", "Takri", "Tale", "Tai_Le", "Talu", "New_Tai_Lue", "Taml", "Tamil", "Tang", "Tangut", "Tavt", "Tai_Viet", "Telu", "Telugu", "Tfng", "Tifinagh", "Tglg", "Tagalog", "Thaa", "Thaana", "Thai", "Tibt", "Tibetan", "Tirh", "Tirhuta", "Tnsa", "Tangsa", "Toto", "Ugar", "Ugaritic", "Vaii", "Vai", "Vith", "Vithkuqi", "Wara", "Warang_Citi", "Wcho", "Wancho", "Xpeo", "Old_Persian", "Xsux", "Cuneiform", "Yezi", "Yezidi", "Yiii", "Yi", "Zanb", "Zanabazar_Square", "Zinh", "Inherited", "Qaai", "Zyyy", "Common", "Zzzz", "Unknown"]),
    Script_Extensions: undefined! as Set<string>,
};
// The Script_Extensions property of a character contains one or more Script values. See https://www.unicode.org/reports/tr24/#Script_Extensions
// Here since each Unicode property value expression only allows a single value, its values can be considered the same as those of the Script property.
valuesOfNonBinaryUnicodeProperties.Script_Extensions = valuesOfNonBinaryUnicodeProperties.Script;
