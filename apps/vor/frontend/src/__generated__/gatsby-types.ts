/* eslint-disable */

declare namespace GatsbyTypes {
  type Maybe<T> = T | undefined
  type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
  type MakeOptional<T, K extends keyof T> = Omit<T, K> &
    { [SubKey in K]?: Maybe<T[SubKey]> }
  type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
    { [SubKey in K]: Maybe<T[SubKey]> }
  /** All built-in and custom scalars, mapped to their actual values */
  type Scalars = {
    /** The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID. */
    ID: string
    /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
    String: string
    /** The `Boolean` scalar type represents `true` or `false`. */
    Boolean: boolean
    /** The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. */
    Int: number
    /** The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). */
    Float: number
    /** A date string, such as 2007-12-03, compliant with the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
    Date: string
    /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
    JSON: never
  }

  type File = Node & {
    readonly sourceInstanceName: Scalars["String"]
    readonly absolutePath: Scalars["String"]
    readonly relativePath: Scalars["String"]
    readonly extension: Scalars["String"]
    readonly size: Scalars["Int"]
    readonly prettySize: Scalars["String"]
    readonly modifiedTime: Scalars["Date"]
    readonly accessTime: Scalars["Date"]
    readonly changeTime: Scalars["Date"]
    readonly birthTime: Scalars["Date"]
    readonly root: Scalars["String"]
    readonly dir: Scalars["String"]
    readonly base: Scalars["String"]
    readonly ext: Scalars["String"]
    readonly name: Scalars["String"]
    readonly relativeDirectory: Scalars["String"]
    readonly dev: Scalars["Int"]
    readonly mode: Scalars["Int"]
    readonly nlink: Scalars["Int"]
    readonly uid: Scalars["Int"]
    readonly gid: Scalars["Int"]
    readonly rdev: Scalars["Int"]
    readonly ino: Scalars["Float"]
    readonly atimeMs: Scalars["Float"]
    readonly mtimeMs: Scalars["Float"]
    readonly ctimeMs: Scalars["Float"]
    readonly atime: Scalars["Date"]
    readonly mtime: Scalars["Date"]
    readonly ctime: Scalars["Date"]
    /** @deprecated Use `birthTime` instead */
    readonly birthtime: Maybe<Scalars["Date"]>
    /** @deprecated Use `birthTime` instead */
    readonly birthtimeMs: Maybe<Scalars["Float"]>
    readonly blksize: Maybe<Scalars["Int"]>
    readonly blocks: Maybe<Scalars["Int"]>
    /** Copy file to static directory and return public url to it */
    readonly publicURL: Maybe<Scalars["String"]>
    /** Returns all children nodes filtered by type ImageSharp */
    readonly childrenImageSharp: Maybe<ReadonlyArray<Maybe<ImageSharp>>>
    /** Returns the first child node of type ImageSharp or null if there are no children of given type on this node */
    readonly childImageSharp: Maybe<ImageSharp>
    readonly id: Scalars["ID"]
    readonly parent: Maybe<Node>
    readonly children: ReadonlyArray<Node>
    readonly internal: Internal
  }

  type File_modifiedTimeArgs = {
    formatString: Maybe<Scalars["String"]>
    fromNow: Maybe<Scalars["Boolean"]>
    difference: Maybe<Scalars["String"]>
    locale: Maybe<Scalars["String"]>
  }

  type File_accessTimeArgs = {
    formatString: Maybe<Scalars["String"]>
    fromNow: Maybe<Scalars["Boolean"]>
    difference: Maybe<Scalars["String"]>
    locale: Maybe<Scalars["String"]>
  }

  type File_changeTimeArgs = {
    formatString: Maybe<Scalars["String"]>
    fromNow: Maybe<Scalars["Boolean"]>
    difference: Maybe<Scalars["String"]>
    locale: Maybe<Scalars["String"]>
  }

  type File_birthTimeArgs = {
    formatString: Maybe<Scalars["String"]>
    fromNow: Maybe<Scalars["Boolean"]>
    difference: Maybe<Scalars["String"]>
    locale: Maybe<Scalars["String"]>
  }

  type File_atimeArgs = {
    formatString: Maybe<Scalars["String"]>
    fromNow: Maybe<Scalars["Boolean"]>
    difference: Maybe<Scalars["String"]>
    locale: Maybe<Scalars["String"]>
  }

  type File_mtimeArgs = {
    formatString: Maybe<Scalars["String"]>
    fromNow: Maybe<Scalars["Boolean"]>
    difference: Maybe<Scalars["String"]>
    locale: Maybe<Scalars["String"]>
  }

  type File_ctimeArgs = {
    formatString: Maybe<Scalars["String"]>
    fromNow: Maybe<Scalars["Boolean"]>
    difference: Maybe<Scalars["String"]>
    locale: Maybe<Scalars["String"]>
  }

  /** Node Interface */
  type Node = {
    readonly id: Scalars["ID"]
    readonly parent: Maybe<Node>
    readonly children: ReadonlyArray<Node>
    readonly internal: Internal
  }

  type Internal = {
    readonly content: Maybe<Scalars["String"]>
    readonly contentDigest: Scalars["String"]
    readonly description: Maybe<Scalars["String"]>
    readonly fieldOwners: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    readonly ignoreType: Maybe<Scalars["Boolean"]>
    readonly mediaType: Maybe<Scalars["String"]>
    readonly owner: Scalars["String"]
    readonly type: Scalars["String"]
  }

  type Directory = Node & {
    readonly sourceInstanceName: Scalars["String"]
    readonly absolutePath: Scalars["String"]
    readonly relativePath: Scalars["String"]
    readonly extension: Scalars["String"]
    readonly size: Scalars["Int"]
    readonly prettySize: Scalars["String"]
    readonly modifiedTime: Scalars["Date"]
    readonly accessTime: Scalars["Date"]
    readonly changeTime: Scalars["Date"]
    readonly birthTime: Scalars["Date"]
    readonly root: Scalars["String"]
    readonly dir: Scalars["String"]
    readonly base: Scalars["String"]
    readonly ext: Scalars["String"]
    readonly name: Scalars["String"]
    readonly relativeDirectory: Scalars["String"]
    readonly dev: Scalars["Int"]
    readonly mode: Scalars["Int"]
    readonly nlink: Scalars["Int"]
    readonly uid: Scalars["Int"]
    readonly gid: Scalars["Int"]
    readonly rdev: Scalars["Int"]
    readonly ino: Scalars["Float"]
    readonly atimeMs: Scalars["Float"]
    readonly mtimeMs: Scalars["Float"]
    readonly ctimeMs: Scalars["Float"]
    readonly atime: Scalars["Date"]
    readonly mtime: Scalars["Date"]
    readonly ctime: Scalars["Date"]
    /** @deprecated Use `birthTime` instead */
    readonly birthtime: Maybe<Scalars["Date"]>
    /** @deprecated Use `birthTime` instead */
    readonly birthtimeMs: Maybe<Scalars["Float"]>
    readonly blksize: Maybe<Scalars["Int"]>
    readonly blocks: Maybe<Scalars["Int"]>
    readonly id: Scalars["ID"]
    readonly parent: Maybe<Node>
    readonly children: ReadonlyArray<Node>
    readonly internal: Internal
  }

  type Directory_modifiedTimeArgs = {
    formatString: Maybe<Scalars["String"]>
    fromNow: Maybe<Scalars["Boolean"]>
    difference: Maybe<Scalars["String"]>
    locale: Maybe<Scalars["String"]>
  }

  type Directory_accessTimeArgs = {
    formatString: Maybe<Scalars["String"]>
    fromNow: Maybe<Scalars["Boolean"]>
    difference: Maybe<Scalars["String"]>
    locale: Maybe<Scalars["String"]>
  }

  type Directory_changeTimeArgs = {
    formatString: Maybe<Scalars["String"]>
    fromNow: Maybe<Scalars["Boolean"]>
    difference: Maybe<Scalars["String"]>
    locale: Maybe<Scalars["String"]>
  }

  type Directory_birthTimeArgs = {
    formatString: Maybe<Scalars["String"]>
    fromNow: Maybe<Scalars["Boolean"]>
    difference: Maybe<Scalars["String"]>
    locale: Maybe<Scalars["String"]>
  }

  type Directory_atimeArgs = {
    formatString: Maybe<Scalars["String"]>
    fromNow: Maybe<Scalars["Boolean"]>
    difference: Maybe<Scalars["String"]>
    locale: Maybe<Scalars["String"]>
  }

  type Directory_mtimeArgs = {
    formatString: Maybe<Scalars["String"]>
    fromNow: Maybe<Scalars["Boolean"]>
    difference: Maybe<Scalars["String"]>
    locale: Maybe<Scalars["String"]>
  }

  type Directory_ctimeArgs = {
    formatString: Maybe<Scalars["String"]>
    fromNow: Maybe<Scalars["Boolean"]>
    difference: Maybe<Scalars["String"]>
    locale: Maybe<Scalars["String"]>
  }

  type Site = Node & {
    readonly buildTime: Maybe<Scalars["Date"]>
    readonly siteMetadata: Maybe<SiteSiteMetadata>
    readonly port: Maybe<Scalars["Int"]>
    readonly host: Maybe<Scalars["String"]>
    readonly flags: Maybe<SiteFlags>
    readonly polyfill: Maybe<Scalars["Boolean"]>
    readonly pathPrefix: Maybe<Scalars["String"]>
    readonly id: Scalars["ID"]
    readonly parent: Maybe<Node>
    readonly children: ReadonlyArray<Node>
    readonly internal: Internal
  }

  type Site_buildTimeArgs = {
    formatString: Maybe<Scalars["String"]>
    fromNow: Maybe<Scalars["Boolean"]>
    difference: Maybe<Scalars["String"]>
    locale: Maybe<Scalars["String"]>
  }

  type SiteFlags = {
    readonly FAST_DEV: Maybe<Scalars["Boolean"]>
    readonly DEV_WEBPACK_CACHE: Maybe<Scalars["Boolean"]>
    readonly PARALLEL_SOURCING: Maybe<Scalars["Boolean"]>
  }

  type SiteSiteMetadata = {
    readonly title: Maybe<Scalars["String"]>
    readonly description: Maybe<Scalars["String"]>
    readonly author: Maybe<Scalars["String"]>
    readonly siteUrl: Maybe<Scalars["String"]>
  }

  type SiteFunction = Node & {
    readonly functionRoute: Scalars["String"]
    readonly pluginName: Scalars["String"]
    readonly originalAbsoluteFilePath: Scalars["String"]
    readonly originalRelativeFilePath: Scalars["String"]
    readonly relativeCompiledFilePath: Scalars["String"]
    readonly absoluteCompiledFilePath: Scalars["String"]
    readonly matchPath: Maybe<Scalars["String"]>
    readonly id: Scalars["ID"]
    readonly parent: Maybe<Node>
    readonly children: ReadonlyArray<Node>
    readonly internal: Internal
  }

  type SitePage = Node & {
    readonly path: Scalars["String"]
    readonly component: Scalars["String"]
    readonly internalComponentName: Scalars["String"]
    readonly componentChunkName: Scalars["String"]
    readonly matchPath: Maybe<Scalars["String"]>
    readonly id: Scalars["ID"]
    readonly parent: Maybe<Node>
    readonly children: ReadonlyArray<Node>
    readonly internal: Internal
    readonly isCreatedByStatefulCreatePages: Maybe<Scalars["Boolean"]>
    readonly context: Maybe<SitePageContext>
    readonly pluginCreator: Maybe<SitePlugin>
    readonly pluginCreatorId: Maybe<Scalars["String"]>
  }

  type SitePageContext = {
    readonly locale: Maybe<Scalars["String"]>
    readonly hrefLang: Maybe<Scalars["String"]>
    readonly originalPath: Maybe<Scalars["String"]>
    readonly dateFormat: Maybe<Scalars["String"]>
    readonly layout: Maybe<Scalars["String"]>
  }

  type ThemeUiConfig = Node & {
    readonly preset: Maybe<Scalars["JSON"]>
    readonly prismPreset: Maybe<Scalars["JSON"]>
    readonly id: Scalars["ID"]
    readonly parent: Maybe<Node>
    readonly children: ReadonlyArray<Node>
    readonly internal: Internal
  }

  type ImageFormat = "NO_CHANGE" | "AUTO" | "jpg" | "png" | "webp" | "avif"

  type ImageFit = "cover" | "contain" | "fill" | "inside" | "outside"

  type ImageLayout = "fixed" | "fullWidth" | "constrained"

  type ImageCropFocus = "CENTER" | 1 | 5 | 2 | 6 | 3 | 7 | 4 | 8 | 16 | 17

  type DuotoneGradient = {
    readonly highlight: Scalars["String"]
    readonly shadow: Scalars["String"]
    readonly opacity: Maybe<Scalars["Int"]>
  }

  type PotraceTurnPolicy =
    | "black"
    | "white"
    | "left"
    | "right"
    | "minority"
    | "majority"

  type Potrace = {
    readonly turnPolicy: Maybe<PotraceTurnPolicy>
    readonly turdSize: Maybe<Scalars["Float"]>
    readonly alphaMax: Maybe<Scalars["Float"]>
    readonly optCurve: Maybe<Scalars["Boolean"]>
    readonly optTolerance: Maybe<Scalars["Float"]>
    readonly threshold: Maybe<Scalars["Int"]>
    readonly blackOnWhite: Maybe<Scalars["Boolean"]>
    readonly color: Maybe<Scalars["String"]>
    readonly background: Maybe<Scalars["String"]>
  }

  type ImageSharp = Node & {
    readonly fixed: Maybe<ImageSharpFixed>
    readonly fluid: Maybe<ImageSharpFluid>
    readonly gatsbyImageData: Scalars["JSON"]
    readonly original: Maybe<ImageSharpOriginal>
    readonly resize: Maybe<ImageSharpResize>
    readonly id: Scalars["ID"]
    readonly parent: Maybe<Node>
    readonly children: ReadonlyArray<Node>
    readonly internal: Internal
  }

  type ImageSharp_fixedArgs = {
    width: Maybe<Scalars["Int"]>
    height: Maybe<Scalars["Int"]>
    base64Width: Maybe<Scalars["Int"]>
    jpegProgressive?: Maybe<Scalars["Boolean"]>
    pngCompressionSpeed?: Maybe<Scalars["Int"]>
    grayscale?: Maybe<Scalars["Boolean"]>
    duotone: Maybe<DuotoneGradient>
    traceSVG: Maybe<Potrace>
    quality: Maybe<Scalars["Int"]>
    jpegQuality: Maybe<Scalars["Int"]>
    pngQuality: Maybe<Scalars["Int"]>
    webpQuality: Maybe<Scalars["Int"]>
    toFormat?: Maybe<ImageFormat>
    toFormatBase64?: Maybe<ImageFormat>
    cropFocus?: Maybe<ImageCropFocus>
    fit?: Maybe<ImageFit>
    background?: Maybe<Scalars["String"]>
    rotate?: Maybe<Scalars["Int"]>
    trim?: Maybe<Scalars["Float"]>
  }

  type ImageSharp_fluidArgs = {
    maxWidth: Maybe<Scalars["Int"]>
    maxHeight: Maybe<Scalars["Int"]>
    base64Width: Maybe<Scalars["Int"]>
    grayscale?: Maybe<Scalars["Boolean"]>
    jpegProgressive?: Maybe<Scalars["Boolean"]>
    pngCompressionSpeed?: Maybe<Scalars["Int"]>
    duotone: Maybe<DuotoneGradient>
    traceSVG: Maybe<Potrace>
    quality: Maybe<Scalars["Int"]>
    jpegQuality: Maybe<Scalars["Int"]>
    pngQuality: Maybe<Scalars["Int"]>
    webpQuality: Maybe<Scalars["Int"]>
    toFormat?: Maybe<ImageFormat>
    toFormatBase64?: Maybe<ImageFormat>
    cropFocus?: Maybe<ImageCropFocus>
    fit?: Maybe<ImageFit>
    background?: Maybe<Scalars["String"]>
    rotate?: Maybe<Scalars["Int"]>
    trim?: Maybe<Scalars["Float"]>
    sizes?: Maybe<Scalars["String"]>
    srcSetBreakpoints?: Maybe<ReadonlyArray<Maybe<Scalars["Int"]>>>
  }

  type ImageSharp_gatsbyImageDataArgs = {
    layout?: Maybe<ImageLayout>
    width: Maybe<Scalars["Int"]>
    height: Maybe<Scalars["Int"]>
    aspectRatio: Maybe<Scalars["Float"]>
    placeholder: Maybe<ImagePlaceholder>
    blurredOptions: Maybe<BlurredOptions>
    tracedSVGOptions: Maybe<Potrace>
    formats: Maybe<ReadonlyArray<Maybe<ImageFormat>>>
    outputPixelDensities: Maybe<ReadonlyArray<Maybe<Scalars["Float"]>>>
    breakpoints: Maybe<ReadonlyArray<Maybe<Scalars["Int"]>>>
    sizes: Maybe<Scalars["String"]>
    quality: Maybe<Scalars["Int"]>
    jpgOptions: Maybe<JPGOptions>
    pngOptions: Maybe<PNGOptions>
    webpOptions: Maybe<WebPOptions>
    avifOptions: Maybe<AVIFOptions>
    transformOptions: Maybe<TransformOptions>
    backgroundColor: Maybe<Scalars["String"]>
  }

  type ImageSharp_resizeArgs = {
    width: Maybe<Scalars["Int"]>
    height: Maybe<Scalars["Int"]>
    quality: Maybe<Scalars["Int"]>
    jpegQuality: Maybe<Scalars["Int"]>
    pngQuality: Maybe<Scalars["Int"]>
    webpQuality: Maybe<Scalars["Int"]>
    jpegProgressive?: Maybe<Scalars["Boolean"]>
    pngCompressionLevel?: Maybe<Scalars["Int"]>
    pngCompressionSpeed?: Maybe<Scalars["Int"]>
    grayscale?: Maybe<Scalars["Boolean"]>
    duotone: Maybe<DuotoneGradient>
    base64?: Maybe<Scalars["Boolean"]>
    traceSVG: Maybe<Potrace>
    toFormat?: Maybe<ImageFormat>
    cropFocus?: Maybe<ImageCropFocus>
    fit?: Maybe<ImageFit>
    background?: Maybe<Scalars["String"]>
    rotate?: Maybe<Scalars["Int"]>
    trim?: Maybe<Scalars["Float"]>
  }

  type ImageSharpFixed = {
    readonly base64: Maybe<Scalars["String"]>
    readonly tracedSVG: Maybe<Scalars["String"]>
    readonly aspectRatio: Maybe<Scalars["Float"]>
    readonly width: Scalars["Float"]
    readonly height: Scalars["Float"]
    readonly src: Scalars["String"]
    readonly srcSet: Scalars["String"]
    readonly srcWebp: Maybe<Scalars["String"]>
    readonly srcSetWebp: Maybe<Scalars["String"]>
    readonly originalName: Maybe<Scalars["String"]>
  }

  type ImageSharpFluid = {
    readonly base64: Maybe<Scalars["String"]>
    readonly tracedSVG: Maybe<Scalars["String"]>
    readonly aspectRatio: Scalars["Float"]
    readonly src: Scalars["String"]
    readonly srcSet: Scalars["String"]
    readonly srcWebp: Maybe<Scalars["String"]>
    readonly srcSetWebp: Maybe<Scalars["String"]>
    readonly sizes: Scalars["String"]
    readonly originalImg: Maybe<Scalars["String"]>
    readonly originalName: Maybe<Scalars["String"]>
    readonly presentationWidth: Scalars["Int"]
    readonly presentationHeight: Scalars["Int"]
  }

  type ImagePlaceholder = "dominantColor" | "tracedSVG" | "blurred" | "none"

  type BlurredOptions = {
    /** Width of the generated low-res preview. Default is 20px */
    readonly width: Maybe<Scalars["Int"]>
    /** Force the output format for the low-res preview. Default is to use the same format as the input. You should rarely need to change this */
    readonly toFormat: Maybe<ImageFormat>
  }

  type JPGOptions = {
    readonly quality: Maybe<Scalars["Int"]>
    readonly progressive: Maybe<Scalars["Boolean"]>
  }

  type PNGOptions = {
    readonly quality: Maybe<Scalars["Int"]>
    readonly compressionSpeed: Maybe<Scalars["Int"]>
  }

  type WebPOptions = {
    readonly quality: Maybe<Scalars["Int"]>
  }

  type AVIFOptions = {
    readonly quality: Maybe<Scalars["Int"]>
    readonly lossless: Maybe<Scalars["Boolean"]>
    readonly speed: Maybe<Scalars["Int"]>
  }

  type TransformOptions = {
    readonly grayscale: Maybe<Scalars["Boolean"]>
    readonly duotone: Maybe<DuotoneGradient>
    readonly rotate: Maybe<Scalars["Int"]>
    readonly trim: Maybe<Scalars["Float"]>
    readonly cropFocus: Maybe<ImageCropFocus>
    readonly fit: Maybe<ImageFit>
  }

  type ImageSharpOriginal = {
    readonly width: Maybe<Scalars["Float"]>
    readonly height: Maybe<Scalars["Float"]>
    readonly src: Maybe<Scalars["String"]>
  }

  type ImageSharpResize = {
    readonly src: Maybe<Scalars["String"]>
    readonly tracedSVG: Maybe<Scalars["String"]>
    readonly width: Maybe<Scalars["Int"]>
    readonly height: Maybe<Scalars["Int"]>
    readonly aspectRatio: Maybe<Scalars["Float"]>
    readonly originalName: Maybe<Scalars["String"]>
  }

  type ThemeI18n = Node & {
    readonly defaultLang: Maybe<Scalars["String"]>
    readonly prefixDefault: Maybe<Scalars["Boolean"]>
    readonly configPath: Maybe<Scalars["String"]>
    readonly config: Maybe<ReadonlyArray<Maybe<Locale>>>
    readonly id: Scalars["ID"]
    readonly parent: Maybe<Node>
    readonly children: ReadonlyArray<Node>
    readonly internal: Internal
  }

  type Locale = {
    readonly code: Maybe<Scalars["String"]>
    readonly hrefLang: Maybe<Scalars["String"]>
    readonly dateFormat: Maybe<Scalars["String"]>
    readonly langDir: Maybe<Scalars["String"]>
    readonly localName: Maybe<Scalars["String"]>
    readonly name: Maybe<Scalars["String"]>
  }

  type SitePlugin = Node & {
    readonly id: Scalars["ID"]
    readonly parent: Maybe<Node>
    readonly children: ReadonlyArray<Node>
    readonly internal: Internal
    readonly resolve: Maybe<Scalars["String"]>
    readonly name: Maybe<Scalars["String"]>
    readonly version: Maybe<Scalars["String"]>
    readonly pluginOptions: Maybe<SitePluginPluginOptions>
    readonly nodeAPIs: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    readonly browserAPIs: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    readonly ssrAPIs: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    readonly pluginFilepath: Maybe<Scalars["String"]>
    readonly packageJson: Maybe<SitePluginPackageJson>
  }

  type SitePluginPluginOptions = {
    readonly name: Maybe<Scalars["String"]>
    readonly path: Maybe<Scalars["String"]>
    readonly base64Width: Maybe<Scalars["Int"]>
    readonly stripMetadata: Maybe<Scalars["Boolean"]>
    readonly defaultQuality: Maybe<Scalars["Int"]>
    readonly failOnError: Maybe<Scalars["Boolean"]>
    readonly short_name: Maybe<Scalars["String"]>
    readonly start_url: Maybe<Scalars["String"]>
    readonly background_color: Maybe<Scalars["String"]>
    readonly theme_color: Maybe<Scalars["String"]>
    readonly display: Maybe<Scalars["String"]>
    readonly icon: Maybe<Scalars["String"]>
    readonly icon_options: Maybe<SitePluginPluginOptionsIcon_options>
    readonly legacy: Maybe<Scalars["Boolean"]>
    readonly theme_color_in_head: Maybe<Scalars["Boolean"]>
    readonly cache_busting_mode: Maybe<Scalars["String"]>
    readonly crossOrigin: Maybe<Scalars["String"]>
    readonly include_favicon: Maybe<Scalars["Boolean"]>
    readonly cacheDigest: Maybe<Scalars["String"]>
    readonly prettier: Maybe<Scalars["Boolean"]>
    readonly svgo: Maybe<Scalars["Boolean"]>
    readonly svgoConfig: Maybe<SitePluginPluginOptionsSvgoConfig>
    readonly siteUrl: Maybe<Scalars["String"]>
    readonly color: Maybe<Scalars["String"]>
    readonly showSpinner: Maybe<Scalars["Boolean"]>
    readonly defaultLang: Maybe<Scalars["String"]>
    readonly configPath: Maybe<Scalars["String"]>
    readonly localeDir: Maybe<Scalars["String"]>
    readonly emitSchema: Maybe<SitePluginPluginOptionsEmitSchema>
    readonly pathCheck: Maybe<Scalars["Boolean"]>
    readonly allExtensions: Maybe<Scalars["Boolean"]>
    readonly isTSX: Maybe<Scalars["Boolean"]>
    readonly jsxPragma: Maybe<Scalars["String"]>
  }

  type SitePluginPluginOptionsIcon_options = {
    readonly purpose: Maybe<Scalars["String"]>
  }

  type SitePluginPluginOptionsSvgoConfig = {
    readonly removeViewBox: Maybe<Scalars["Boolean"]>
    readonly cleanupIDs: Maybe<Scalars["Boolean"]>
  }

  type SitePluginPluginOptionsEmitSchema = {
    readonly src___generated___gatsby_schema_graphql: Maybe<Scalars["Boolean"]>
  }

  type SitePluginPackageJson = {
    readonly name: Maybe<Scalars["String"]>
    readonly description: Maybe<Scalars["String"]>
    readonly version: Maybe<Scalars["String"]>
    readonly main: Maybe<Scalars["String"]>
    readonly license: Maybe<Scalars["String"]>
    readonly dependencies: Maybe<
      ReadonlyArray<Maybe<SitePluginPackageJsonDependencies>>
    >
    readonly devDependencies: Maybe<
      ReadonlyArray<Maybe<SitePluginPackageJsonDevDependencies>>
    >
    readonly peerDependencies: Maybe<
      ReadonlyArray<Maybe<SitePluginPackageJsonPeerDependencies>>
    >
    readonly keywords: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
  }

  type SitePluginPackageJsonDependencies = {
    readonly name: Maybe<Scalars["String"]>
    readonly version: Maybe<Scalars["String"]>
  }

  type SitePluginPackageJsonDevDependencies = {
    readonly name: Maybe<Scalars["String"]>
    readonly version: Maybe<Scalars["String"]>
  }

  type SitePluginPackageJsonPeerDependencies = {
    readonly name: Maybe<Scalars["String"]>
    readonly version: Maybe<Scalars["String"]>
  }

  type SiteBuildMetadata = Node & {
    readonly id: Scalars["ID"]
    readonly parent: Maybe<Node>
    readonly children: ReadonlyArray<Node>
    readonly internal: Internal
    readonly buildTime: Maybe<Scalars["Date"]>
  }

  type SiteBuildMetadata_buildTimeArgs = {
    formatString: Maybe<Scalars["String"]>
    fromNow: Maybe<Scalars["Boolean"]>
    difference: Maybe<Scalars["String"]>
    locale: Maybe<Scalars["String"]>
  }

  type Query = {
    readonly file: Maybe<File>
    readonly allFile: FileConnection
    readonly directory: Maybe<Directory>
    readonly allDirectory: DirectoryConnection
    readonly site: Maybe<Site>
    readonly allSite: SiteConnection
    readonly siteFunction: Maybe<SiteFunction>
    readonly allSiteFunction: SiteFunctionConnection
    readonly sitePage: Maybe<SitePage>
    readonly allSitePage: SitePageConnection
    readonly themeUiConfig: Maybe<ThemeUiConfig>
    readonly allThemeUiConfig: ThemeUiConfigConnection
    readonly imageSharp: Maybe<ImageSharp>
    readonly allImageSharp: ImageSharpConnection
    readonly themeI18N: Maybe<ThemeI18n>
    readonly allThemeI18N: ThemeI18nConnection
    readonly sitePlugin: Maybe<SitePlugin>
    readonly allSitePlugin: SitePluginConnection
    readonly siteBuildMetadata: Maybe<SiteBuildMetadata>
    readonly allSiteBuildMetadata: SiteBuildMetadataConnection
  }

  type Query_fileArgs = {
    sourceInstanceName: Maybe<StringQueryOperatorInput>
    absolutePath: Maybe<StringQueryOperatorInput>
    relativePath: Maybe<StringQueryOperatorInput>
    extension: Maybe<StringQueryOperatorInput>
    size: Maybe<IntQueryOperatorInput>
    prettySize: Maybe<StringQueryOperatorInput>
    modifiedTime: Maybe<DateQueryOperatorInput>
    accessTime: Maybe<DateQueryOperatorInput>
    changeTime: Maybe<DateQueryOperatorInput>
    birthTime: Maybe<DateQueryOperatorInput>
    root: Maybe<StringQueryOperatorInput>
    dir: Maybe<StringQueryOperatorInput>
    base: Maybe<StringQueryOperatorInput>
    ext: Maybe<StringQueryOperatorInput>
    name: Maybe<StringQueryOperatorInput>
    relativeDirectory: Maybe<StringQueryOperatorInput>
    dev: Maybe<IntQueryOperatorInput>
    mode: Maybe<IntQueryOperatorInput>
    nlink: Maybe<IntQueryOperatorInput>
    uid: Maybe<IntQueryOperatorInput>
    gid: Maybe<IntQueryOperatorInput>
    rdev: Maybe<IntQueryOperatorInput>
    ino: Maybe<FloatQueryOperatorInput>
    atimeMs: Maybe<FloatQueryOperatorInput>
    mtimeMs: Maybe<FloatQueryOperatorInput>
    ctimeMs: Maybe<FloatQueryOperatorInput>
    atime: Maybe<DateQueryOperatorInput>
    mtime: Maybe<DateQueryOperatorInput>
    ctime: Maybe<DateQueryOperatorInput>
    birthtime: Maybe<DateQueryOperatorInput>
    birthtimeMs: Maybe<FloatQueryOperatorInput>
    blksize: Maybe<IntQueryOperatorInput>
    blocks: Maybe<IntQueryOperatorInput>
    publicURL: Maybe<StringQueryOperatorInput>
    childrenImageSharp: Maybe<ImageSharpFilterListInput>
    childImageSharp: Maybe<ImageSharpFilterInput>
    id: Maybe<StringQueryOperatorInput>
    parent: Maybe<NodeFilterInput>
    children: Maybe<NodeFilterListInput>
    internal: Maybe<InternalFilterInput>
  }

  type Query_allFileArgs = {
    filter: Maybe<FileFilterInput>
    sort: Maybe<FileSortInput>
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
  }

  type Query_directoryArgs = {
    sourceInstanceName: Maybe<StringQueryOperatorInput>
    absolutePath: Maybe<StringQueryOperatorInput>
    relativePath: Maybe<StringQueryOperatorInput>
    extension: Maybe<StringQueryOperatorInput>
    size: Maybe<IntQueryOperatorInput>
    prettySize: Maybe<StringQueryOperatorInput>
    modifiedTime: Maybe<DateQueryOperatorInput>
    accessTime: Maybe<DateQueryOperatorInput>
    changeTime: Maybe<DateQueryOperatorInput>
    birthTime: Maybe<DateQueryOperatorInput>
    root: Maybe<StringQueryOperatorInput>
    dir: Maybe<StringQueryOperatorInput>
    base: Maybe<StringQueryOperatorInput>
    ext: Maybe<StringQueryOperatorInput>
    name: Maybe<StringQueryOperatorInput>
    relativeDirectory: Maybe<StringQueryOperatorInput>
    dev: Maybe<IntQueryOperatorInput>
    mode: Maybe<IntQueryOperatorInput>
    nlink: Maybe<IntQueryOperatorInput>
    uid: Maybe<IntQueryOperatorInput>
    gid: Maybe<IntQueryOperatorInput>
    rdev: Maybe<IntQueryOperatorInput>
    ino: Maybe<FloatQueryOperatorInput>
    atimeMs: Maybe<FloatQueryOperatorInput>
    mtimeMs: Maybe<FloatQueryOperatorInput>
    ctimeMs: Maybe<FloatQueryOperatorInput>
    atime: Maybe<DateQueryOperatorInput>
    mtime: Maybe<DateQueryOperatorInput>
    ctime: Maybe<DateQueryOperatorInput>
    birthtime: Maybe<DateQueryOperatorInput>
    birthtimeMs: Maybe<FloatQueryOperatorInput>
    blksize: Maybe<IntQueryOperatorInput>
    blocks: Maybe<IntQueryOperatorInput>
    id: Maybe<StringQueryOperatorInput>
    parent: Maybe<NodeFilterInput>
    children: Maybe<NodeFilterListInput>
    internal: Maybe<InternalFilterInput>
  }

  type Query_allDirectoryArgs = {
    filter: Maybe<DirectoryFilterInput>
    sort: Maybe<DirectorySortInput>
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
  }

  type Query_siteArgs = {
    buildTime: Maybe<DateQueryOperatorInput>
    siteMetadata: Maybe<SiteSiteMetadataFilterInput>
    port: Maybe<IntQueryOperatorInput>
    host: Maybe<StringQueryOperatorInput>
    flags: Maybe<SiteFlagsFilterInput>
    polyfill: Maybe<BooleanQueryOperatorInput>
    pathPrefix: Maybe<StringQueryOperatorInput>
    id: Maybe<StringQueryOperatorInput>
    parent: Maybe<NodeFilterInput>
    children: Maybe<NodeFilterListInput>
    internal: Maybe<InternalFilterInput>
  }

  type Query_allSiteArgs = {
    filter: Maybe<SiteFilterInput>
    sort: Maybe<SiteSortInput>
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
  }

  type Query_siteFunctionArgs = {
    functionRoute: Maybe<StringQueryOperatorInput>
    pluginName: Maybe<StringQueryOperatorInput>
    originalAbsoluteFilePath: Maybe<StringQueryOperatorInput>
    originalRelativeFilePath: Maybe<StringQueryOperatorInput>
    relativeCompiledFilePath: Maybe<StringQueryOperatorInput>
    absoluteCompiledFilePath: Maybe<StringQueryOperatorInput>
    matchPath: Maybe<StringQueryOperatorInput>
    id: Maybe<StringQueryOperatorInput>
    parent: Maybe<NodeFilterInput>
    children: Maybe<NodeFilterListInput>
    internal: Maybe<InternalFilterInput>
  }

  type Query_allSiteFunctionArgs = {
    filter: Maybe<SiteFunctionFilterInput>
    sort: Maybe<SiteFunctionSortInput>
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
  }

  type Query_sitePageArgs = {
    path: Maybe<StringQueryOperatorInput>
    component: Maybe<StringQueryOperatorInput>
    internalComponentName: Maybe<StringQueryOperatorInput>
    componentChunkName: Maybe<StringQueryOperatorInput>
    matchPath: Maybe<StringQueryOperatorInput>
    id: Maybe<StringQueryOperatorInput>
    parent: Maybe<NodeFilterInput>
    children: Maybe<NodeFilterListInput>
    internal: Maybe<InternalFilterInput>
    isCreatedByStatefulCreatePages: Maybe<BooleanQueryOperatorInput>
    context: Maybe<SitePageContextFilterInput>
    pluginCreator: Maybe<SitePluginFilterInput>
    pluginCreatorId: Maybe<StringQueryOperatorInput>
  }

  type Query_allSitePageArgs = {
    filter: Maybe<SitePageFilterInput>
    sort: Maybe<SitePageSortInput>
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
  }

  type Query_themeUiConfigArgs = {
    preset: Maybe<JSONQueryOperatorInput>
    prismPreset: Maybe<JSONQueryOperatorInput>
    id: Maybe<StringQueryOperatorInput>
    parent: Maybe<NodeFilterInput>
    children: Maybe<NodeFilterListInput>
    internal: Maybe<InternalFilterInput>
  }

  type Query_allThemeUiConfigArgs = {
    filter: Maybe<ThemeUiConfigFilterInput>
    sort: Maybe<ThemeUiConfigSortInput>
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
  }

  type Query_imageSharpArgs = {
    fixed: Maybe<ImageSharpFixedFilterInput>
    fluid: Maybe<ImageSharpFluidFilterInput>
    gatsbyImageData: Maybe<JSONQueryOperatorInput>
    original: Maybe<ImageSharpOriginalFilterInput>
    resize: Maybe<ImageSharpResizeFilterInput>
    id: Maybe<StringQueryOperatorInput>
    parent: Maybe<NodeFilterInput>
    children: Maybe<NodeFilterListInput>
    internal: Maybe<InternalFilterInput>
  }

  type Query_allImageSharpArgs = {
    filter: Maybe<ImageSharpFilterInput>
    sort: Maybe<ImageSharpSortInput>
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
  }

  type Query_themeI18NArgs = {
    defaultLang: Maybe<StringQueryOperatorInput>
    prefixDefault: Maybe<BooleanQueryOperatorInput>
    configPath: Maybe<StringQueryOperatorInput>
    config: Maybe<LocaleFilterListInput>
    id: Maybe<StringQueryOperatorInput>
    parent: Maybe<NodeFilterInput>
    children: Maybe<NodeFilterListInput>
    internal: Maybe<InternalFilterInput>
  }

  type Query_allThemeI18NArgs = {
    filter: Maybe<ThemeI18nFilterInput>
    sort: Maybe<ThemeI18nSortInput>
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
  }

  type Query_sitePluginArgs = {
    id: Maybe<StringQueryOperatorInput>
    parent: Maybe<NodeFilterInput>
    children: Maybe<NodeFilterListInput>
    internal: Maybe<InternalFilterInput>
    resolve: Maybe<StringQueryOperatorInput>
    name: Maybe<StringQueryOperatorInput>
    version: Maybe<StringQueryOperatorInput>
    pluginOptions: Maybe<SitePluginPluginOptionsFilterInput>
    nodeAPIs: Maybe<StringQueryOperatorInput>
    browserAPIs: Maybe<StringQueryOperatorInput>
    ssrAPIs: Maybe<StringQueryOperatorInput>
    pluginFilepath: Maybe<StringQueryOperatorInput>
    packageJson: Maybe<SitePluginPackageJsonFilterInput>
  }

  type Query_allSitePluginArgs = {
    filter: Maybe<SitePluginFilterInput>
    sort: Maybe<SitePluginSortInput>
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
  }

  type Query_siteBuildMetadataArgs = {
    id: Maybe<StringQueryOperatorInput>
    parent: Maybe<NodeFilterInput>
    children: Maybe<NodeFilterListInput>
    internal: Maybe<InternalFilterInput>
    buildTime: Maybe<DateQueryOperatorInput>
  }

  type Query_allSiteBuildMetadataArgs = {
    filter: Maybe<SiteBuildMetadataFilterInput>
    sort: Maybe<SiteBuildMetadataSortInput>
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
  }

  type StringQueryOperatorInput = {
    readonly eq: Maybe<Scalars["String"]>
    readonly ne: Maybe<Scalars["String"]>
    readonly in: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    readonly nin: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    readonly regex: Maybe<Scalars["String"]>
    readonly glob: Maybe<Scalars["String"]>
  }

  type IntQueryOperatorInput = {
    readonly eq: Maybe<Scalars["Int"]>
    readonly ne: Maybe<Scalars["Int"]>
    readonly gt: Maybe<Scalars["Int"]>
    readonly gte: Maybe<Scalars["Int"]>
    readonly lt: Maybe<Scalars["Int"]>
    readonly lte: Maybe<Scalars["Int"]>
    readonly in: Maybe<ReadonlyArray<Maybe<Scalars["Int"]>>>
    readonly nin: Maybe<ReadonlyArray<Maybe<Scalars["Int"]>>>
  }

  type DateQueryOperatorInput = {
    readonly eq: Maybe<Scalars["Date"]>
    readonly ne: Maybe<Scalars["Date"]>
    readonly gt: Maybe<Scalars["Date"]>
    readonly gte: Maybe<Scalars["Date"]>
    readonly lt: Maybe<Scalars["Date"]>
    readonly lte: Maybe<Scalars["Date"]>
    readonly in: Maybe<ReadonlyArray<Maybe<Scalars["Date"]>>>
    readonly nin: Maybe<ReadonlyArray<Maybe<Scalars["Date"]>>>
  }

  type FloatQueryOperatorInput = {
    readonly eq: Maybe<Scalars["Float"]>
    readonly ne: Maybe<Scalars["Float"]>
    readonly gt: Maybe<Scalars["Float"]>
    readonly gte: Maybe<Scalars["Float"]>
    readonly lt: Maybe<Scalars["Float"]>
    readonly lte: Maybe<Scalars["Float"]>
    readonly in: Maybe<ReadonlyArray<Maybe<Scalars["Float"]>>>
    readonly nin: Maybe<ReadonlyArray<Maybe<Scalars["Float"]>>>
  }

  type ImageSharpFilterListInput = {
    readonly elemMatch: Maybe<ImageSharpFilterInput>
  }

  type ImageSharpFilterInput = {
    readonly fixed: Maybe<ImageSharpFixedFilterInput>
    readonly fluid: Maybe<ImageSharpFluidFilterInput>
    readonly gatsbyImageData: Maybe<JSONQueryOperatorInput>
    readonly original: Maybe<ImageSharpOriginalFilterInput>
    readonly resize: Maybe<ImageSharpResizeFilterInput>
    readonly id: Maybe<StringQueryOperatorInput>
    readonly parent: Maybe<NodeFilterInput>
    readonly children: Maybe<NodeFilterListInput>
    readonly internal: Maybe<InternalFilterInput>
  }

  type ImageSharpFixedFilterInput = {
    readonly base64: Maybe<StringQueryOperatorInput>
    readonly tracedSVG: Maybe<StringQueryOperatorInput>
    readonly aspectRatio: Maybe<FloatQueryOperatorInput>
    readonly width: Maybe<FloatQueryOperatorInput>
    readonly height: Maybe<FloatQueryOperatorInput>
    readonly src: Maybe<StringQueryOperatorInput>
    readonly srcSet: Maybe<StringQueryOperatorInput>
    readonly srcWebp: Maybe<StringQueryOperatorInput>
    readonly srcSetWebp: Maybe<StringQueryOperatorInput>
    readonly originalName: Maybe<StringQueryOperatorInput>
  }

  type ImageSharpFluidFilterInput = {
    readonly base64: Maybe<StringQueryOperatorInput>
    readonly tracedSVG: Maybe<StringQueryOperatorInput>
    readonly aspectRatio: Maybe<FloatQueryOperatorInput>
    readonly src: Maybe<StringQueryOperatorInput>
    readonly srcSet: Maybe<StringQueryOperatorInput>
    readonly srcWebp: Maybe<StringQueryOperatorInput>
    readonly srcSetWebp: Maybe<StringQueryOperatorInput>
    readonly sizes: Maybe<StringQueryOperatorInput>
    readonly originalImg: Maybe<StringQueryOperatorInput>
    readonly originalName: Maybe<StringQueryOperatorInput>
    readonly presentationWidth: Maybe<IntQueryOperatorInput>
    readonly presentationHeight: Maybe<IntQueryOperatorInput>
  }

  type JSONQueryOperatorInput = {
    readonly eq: Maybe<Scalars["JSON"]>
    readonly ne: Maybe<Scalars["JSON"]>
    readonly in: Maybe<ReadonlyArray<Maybe<Scalars["JSON"]>>>
    readonly nin: Maybe<ReadonlyArray<Maybe<Scalars["JSON"]>>>
    readonly regex: Maybe<Scalars["JSON"]>
    readonly glob: Maybe<Scalars["JSON"]>
  }

  type ImageSharpOriginalFilterInput = {
    readonly width: Maybe<FloatQueryOperatorInput>
    readonly height: Maybe<FloatQueryOperatorInput>
    readonly src: Maybe<StringQueryOperatorInput>
  }

  type ImageSharpResizeFilterInput = {
    readonly src: Maybe<StringQueryOperatorInput>
    readonly tracedSVG: Maybe<StringQueryOperatorInput>
    readonly width: Maybe<IntQueryOperatorInput>
    readonly height: Maybe<IntQueryOperatorInput>
    readonly aspectRatio: Maybe<FloatQueryOperatorInput>
    readonly originalName: Maybe<StringQueryOperatorInput>
  }

  type NodeFilterInput = {
    readonly id: Maybe<StringQueryOperatorInput>
    readonly parent: Maybe<NodeFilterInput>
    readonly children: Maybe<NodeFilterListInput>
    readonly internal: Maybe<InternalFilterInput>
  }

  type NodeFilterListInput = {
    readonly elemMatch: Maybe<NodeFilterInput>
  }

  type InternalFilterInput = {
    readonly content: Maybe<StringQueryOperatorInput>
    readonly contentDigest: Maybe<StringQueryOperatorInput>
    readonly description: Maybe<StringQueryOperatorInput>
    readonly fieldOwners: Maybe<StringQueryOperatorInput>
    readonly ignoreType: Maybe<BooleanQueryOperatorInput>
    readonly mediaType: Maybe<StringQueryOperatorInput>
    readonly owner: Maybe<StringQueryOperatorInput>
    readonly type: Maybe<StringQueryOperatorInput>
  }

  type BooleanQueryOperatorInput = {
    readonly eq: Maybe<Scalars["Boolean"]>
    readonly ne: Maybe<Scalars["Boolean"]>
    readonly in: Maybe<ReadonlyArray<Maybe<Scalars["Boolean"]>>>
    readonly nin: Maybe<ReadonlyArray<Maybe<Scalars["Boolean"]>>>
  }

  type FileConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<FileEdge>
    readonly nodes: ReadonlyArray<File>
    readonly pageInfo: PageInfo
    readonly distinct: ReadonlyArray<Scalars["String"]>
    readonly max: Maybe<Scalars["Float"]>
    readonly min: Maybe<Scalars["Float"]>
    readonly sum: Maybe<Scalars["Float"]>
    readonly group: ReadonlyArray<FileGroupConnection>
  }

  type FileConnection_distinctArgs = {
    field: FileFieldsEnum
  }

  type FileConnection_maxArgs = {
    field: FileFieldsEnum
  }

  type FileConnection_minArgs = {
    field: FileFieldsEnum
  }

  type FileConnection_sumArgs = {
    field: FileFieldsEnum
  }

  type FileConnection_groupArgs = {
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
    field: FileFieldsEnum
  }

  type FileEdge = {
    readonly next: Maybe<File>
    readonly node: File
    readonly previous: Maybe<File>
  }

  type PageInfo = {
    readonly currentPage: Scalars["Int"]
    readonly hasPreviousPage: Scalars["Boolean"]
    readonly hasNextPage: Scalars["Boolean"]
    readonly itemCount: Scalars["Int"]
    readonly pageCount: Scalars["Int"]
    readonly perPage: Maybe<Scalars["Int"]>
    readonly totalCount: Scalars["Int"]
  }

  type FileFieldsEnum =
    | "sourceInstanceName"
    | "absolutePath"
    | "relativePath"
    | "extension"
    | "size"
    | "prettySize"
    | "modifiedTime"
    | "accessTime"
    | "changeTime"
    | "birthTime"
    | "root"
    | "dir"
    | "base"
    | "ext"
    | "name"
    | "relativeDirectory"
    | "dev"
    | "mode"
    | "nlink"
    | "uid"
    | "gid"
    | "rdev"
    | "ino"
    | "atimeMs"
    | "mtimeMs"
    | "ctimeMs"
    | "atime"
    | "mtime"
    | "ctime"
    | "birthtime"
    | "birthtimeMs"
    | "blksize"
    | "blocks"
    | "publicURL"
    | "childrenImageSharp"
    | "childrenImageSharp.fixed.base64"
    | "childrenImageSharp.fixed.tracedSVG"
    | "childrenImageSharp.fixed.aspectRatio"
    | "childrenImageSharp.fixed.width"
    | "childrenImageSharp.fixed.height"
    | "childrenImageSharp.fixed.src"
    | "childrenImageSharp.fixed.srcSet"
    | "childrenImageSharp.fixed.srcWebp"
    | "childrenImageSharp.fixed.srcSetWebp"
    | "childrenImageSharp.fixed.originalName"
    | "childrenImageSharp.fluid.base64"
    | "childrenImageSharp.fluid.tracedSVG"
    | "childrenImageSharp.fluid.aspectRatio"
    | "childrenImageSharp.fluid.src"
    | "childrenImageSharp.fluid.srcSet"
    | "childrenImageSharp.fluid.srcWebp"
    | "childrenImageSharp.fluid.srcSetWebp"
    | "childrenImageSharp.fluid.sizes"
    | "childrenImageSharp.fluid.originalImg"
    | "childrenImageSharp.fluid.originalName"
    | "childrenImageSharp.fluid.presentationWidth"
    | "childrenImageSharp.fluid.presentationHeight"
    | "childrenImageSharp.gatsbyImageData"
    | "childrenImageSharp.original.width"
    | "childrenImageSharp.original.height"
    | "childrenImageSharp.original.src"
    | "childrenImageSharp.resize.src"
    | "childrenImageSharp.resize.tracedSVG"
    | "childrenImageSharp.resize.width"
    | "childrenImageSharp.resize.height"
    | "childrenImageSharp.resize.aspectRatio"
    | "childrenImageSharp.resize.originalName"
    | "childrenImageSharp.id"
    | "childrenImageSharp.parent.id"
    | "childrenImageSharp.parent.parent.id"
    | "childrenImageSharp.parent.parent.children"
    | "childrenImageSharp.parent.children"
    | "childrenImageSharp.parent.children.id"
    | "childrenImageSharp.parent.children.children"
    | "childrenImageSharp.parent.internal.content"
    | "childrenImageSharp.parent.internal.contentDigest"
    | "childrenImageSharp.parent.internal.description"
    | "childrenImageSharp.parent.internal.fieldOwners"
    | "childrenImageSharp.parent.internal.ignoreType"
    | "childrenImageSharp.parent.internal.mediaType"
    | "childrenImageSharp.parent.internal.owner"
    | "childrenImageSharp.parent.internal.type"
    | "childrenImageSharp.children"
    | "childrenImageSharp.children.id"
    | "childrenImageSharp.children.parent.id"
    | "childrenImageSharp.children.parent.children"
    | "childrenImageSharp.children.children"
    | "childrenImageSharp.children.children.id"
    | "childrenImageSharp.children.children.children"
    | "childrenImageSharp.children.internal.content"
    | "childrenImageSharp.children.internal.contentDigest"
    | "childrenImageSharp.children.internal.description"
    | "childrenImageSharp.children.internal.fieldOwners"
    | "childrenImageSharp.children.internal.ignoreType"
    | "childrenImageSharp.children.internal.mediaType"
    | "childrenImageSharp.children.internal.owner"
    | "childrenImageSharp.children.internal.type"
    | "childrenImageSharp.internal.content"
    | "childrenImageSharp.internal.contentDigest"
    | "childrenImageSharp.internal.description"
    | "childrenImageSharp.internal.fieldOwners"
    | "childrenImageSharp.internal.ignoreType"
    | "childrenImageSharp.internal.mediaType"
    | "childrenImageSharp.internal.owner"
    | "childrenImageSharp.internal.type"
    | "childImageSharp.fixed.base64"
    | "childImageSharp.fixed.tracedSVG"
    | "childImageSharp.fixed.aspectRatio"
    | "childImageSharp.fixed.width"
    | "childImageSharp.fixed.height"
    | "childImageSharp.fixed.src"
    | "childImageSharp.fixed.srcSet"
    | "childImageSharp.fixed.srcWebp"
    | "childImageSharp.fixed.srcSetWebp"
    | "childImageSharp.fixed.originalName"
    | "childImageSharp.fluid.base64"
    | "childImageSharp.fluid.tracedSVG"
    | "childImageSharp.fluid.aspectRatio"
    | "childImageSharp.fluid.src"
    | "childImageSharp.fluid.srcSet"
    | "childImageSharp.fluid.srcWebp"
    | "childImageSharp.fluid.srcSetWebp"
    | "childImageSharp.fluid.sizes"
    | "childImageSharp.fluid.originalImg"
    | "childImageSharp.fluid.originalName"
    | "childImageSharp.fluid.presentationWidth"
    | "childImageSharp.fluid.presentationHeight"
    | "childImageSharp.gatsbyImageData"
    | "childImageSharp.original.width"
    | "childImageSharp.original.height"
    | "childImageSharp.original.src"
    | "childImageSharp.resize.src"
    | "childImageSharp.resize.tracedSVG"
    | "childImageSharp.resize.width"
    | "childImageSharp.resize.height"
    | "childImageSharp.resize.aspectRatio"
    | "childImageSharp.resize.originalName"
    | "childImageSharp.id"
    | "childImageSharp.parent.id"
    | "childImageSharp.parent.parent.id"
    | "childImageSharp.parent.parent.children"
    | "childImageSharp.parent.children"
    | "childImageSharp.parent.children.id"
    | "childImageSharp.parent.children.children"
    | "childImageSharp.parent.internal.content"
    | "childImageSharp.parent.internal.contentDigest"
    | "childImageSharp.parent.internal.description"
    | "childImageSharp.parent.internal.fieldOwners"
    | "childImageSharp.parent.internal.ignoreType"
    | "childImageSharp.parent.internal.mediaType"
    | "childImageSharp.parent.internal.owner"
    | "childImageSharp.parent.internal.type"
    | "childImageSharp.children"
    | "childImageSharp.children.id"
    | "childImageSharp.children.parent.id"
    | "childImageSharp.children.parent.children"
    | "childImageSharp.children.children"
    | "childImageSharp.children.children.id"
    | "childImageSharp.children.children.children"
    | "childImageSharp.children.internal.content"
    | "childImageSharp.children.internal.contentDigest"
    | "childImageSharp.children.internal.description"
    | "childImageSharp.children.internal.fieldOwners"
    | "childImageSharp.children.internal.ignoreType"
    | "childImageSharp.children.internal.mediaType"
    | "childImageSharp.children.internal.owner"
    | "childImageSharp.children.internal.type"
    | "childImageSharp.internal.content"
    | "childImageSharp.internal.contentDigest"
    | "childImageSharp.internal.description"
    | "childImageSharp.internal.fieldOwners"
    | "childImageSharp.internal.ignoreType"
    | "childImageSharp.internal.mediaType"
    | "childImageSharp.internal.owner"
    | "childImageSharp.internal.type"
    | "id"
    | "parent.id"
    | "parent.parent.id"
    | "parent.parent.parent.id"
    | "parent.parent.parent.children"
    | "parent.parent.children"
    | "parent.parent.children.id"
    | "parent.parent.children.children"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.children"
    | "parent.children.id"
    | "parent.children.parent.id"
    | "parent.children.parent.children"
    | "parent.children.children"
    | "parent.children.children.id"
    | "parent.children.children.children"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "children"
    | "children.id"
    | "children.parent.id"
    | "children.parent.parent.id"
    | "children.parent.parent.children"
    | "children.parent.children"
    | "children.parent.children.id"
    | "children.parent.children.children"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.children"
    | "children.children.id"
    | "children.children.parent.id"
    | "children.children.parent.children"
    | "children.children.children"
    | "children.children.children.id"
    | "children.children.children.children"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"

  type FileGroupConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<FileEdge>
    readonly nodes: ReadonlyArray<File>
    readonly pageInfo: PageInfo
    readonly field: Scalars["String"]
    readonly fieldValue: Maybe<Scalars["String"]>
  }

  type FileFilterInput = {
    readonly sourceInstanceName: Maybe<StringQueryOperatorInput>
    readonly absolutePath: Maybe<StringQueryOperatorInput>
    readonly relativePath: Maybe<StringQueryOperatorInput>
    readonly extension: Maybe<StringQueryOperatorInput>
    readonly size: Maybe<IntQueryOperatorInput>
    readonly prettySize: Maybe<StringQueryOperatorInput>
    readonly modifiedTime: Maybe<DateQueryOperatorInput>
    readonly accessTime: Maybe<DateQueryOperatorInput>
    readonly changeTime: Maybe<DateQueryOperatorInput>
    readonly birthTime: Maybe<DateQueryOperatorInput>
    readonly root: Maybe<StringQueryOperatorInput>
    readonly dir: Maybe<StringQueryOperatorInput>
    readonly base: Maybe<StringQueryOperatorInput>
    readonly ext: Maybe<StringQueryOperatorInput>
    readonly name: Maybe<StringQueryOperatorInput>
    readonly relativeDirectory: Maybe<StringQueryOperatorInput>
    readonly dev: Maybe<IntQueryOperatorInput>
    readonly mode: Maybe<IntQueryOperatorInput>
    readonly nlink: Maybe<IntQueryOperatorInput>
    readonly uid: Maybe<IntQueryOperatorInput>
    readonly gid: Maybe<IntQueryOperatorInput>
    readonly rdev: Maybe<IntQueryOperatorInput>
    readonly ino: Maybe<FloatQueryOperatorInput>
    readonly atimeMs: Maybe<FloatQueryOperatorInput>
    readonly mtimeMs: Maybe<FloatQueryOperatorInput>
    readonly ctimeMs: Maybe<FloatQueryOperatorInput>
    readonly atime: Maybe<DateQueryOperatorInput>
    readonly mtime: Maybe<DateQueryOperatorInput>
    readonly ctime: Maybe<DateQueryOperatorInput>
    readonly birthtime: Maybe<DateQueryOperatorInput>
    readonly birthtimeMs: Maybe<FloatQueryOperatorInput>
    readonly blksize: Maybe<IntQueryOperatorInput>
    readonly blocks: Maybe<IntQueryOperatorInput>
    readonly publicURL: Maybe<StringQueryOperatorInput>
    readonly childrenImageSharp: Maybe<ImageSharpFilterListInput>
    readonly childImageSharp: Maybe<ImageSharpFilterInput>
    readonly id: Maybe<StringQueryOperatorInput>
    readonly parent: Maybe<NodeFilterInput>
    readonly children: Maybe<NodeFilterListInput>
    readonly internal: Maybe<InternalFilterInput>
  }

  type FileSortInput = {
    readonly fields: Maybe<ReadonlyArray<Maybe<FileFieldsEnum>>>
    readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>
  }

  type SortOrderEnum = "ASC" | "DESC"

  type DirectoryConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<DirectoryEdge>
    readonly nodes: ReadonlyArray<Directory>
    readonly pageInfo: PageInfo
    readonly distinct: ReadonlyArray<Scalars["String"]>
    readonly max: Maybe<Scalars["Float"]>
    readonly min: Maybe<Scalars["Float"]>
    readonly sum: Maybe<Scalars["Float"]>
    readonly group: ReadonlyArray<DirectoryGroupConnection>
  }

  type DirectoryConnection_distinctArgs = {
    field: DirectoryFieldsEnum
  }

  type DirectoryConnection_maxArgs = {
    field: DirectoryFieldsEnum
  }

  type DirectoryConnection_minArgs = {
    field: DirectoryFieldsEnum
  }

  type DirectoryConnection_sumArgs = {
    field: DirectoryFieldsEnum
  }

  type DirectoryConnection_groupArgs = {
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
    field: DirectoryFieldsEnum
  }

  type DirectoryEdge = {
    readonly next: Maybe<Directory>
    readonly node: Directory
    readonly previous: Maybe<Directory>
  }

  type DirectoryFieldsEnum =
    | "sourceInstanceName"
    | "absolutePath"
    | "relativePath"
    | "extension"
    | "size"
    | "prettySize"
    | "modifiedTime"
    | "accessTime"
    | "changeTime"
    | "birthTime"
    | "root"
    | "dir"
    | "base"
    | "ext"
    | "name"
    | "relativeDirectory"
    | "dev"
    | "mode"
    | "nlink"
    | "uid"
    | "gid"
    | "rdev"
    | "ino"
    | "atimeMs"
    | "mtimeMs"
    | "ctimeMs"
    | "atime"
    | "mtime"
    | "ctime"
    | "birthtime"
    | "birthtimeMs"
    | "blksize"
    | "blocks"
    | "id"
    | "parent.id"
    | "parent.parent.id"
    | "parent.parent.parent.id"
    | "parent.parent.parent.children"
    | "parent.parent.children"
    | "parent.parent.children.id"
    | "parent.parent.children.children"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.children"
    | "parent.children.id"
    | "parent.children.parent.id"
    | "parent.children.parent.children"
    | "parent.children.children"
    | "parent.children.children.id"
    | "parent.children.children.children"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "children"
    | "children.id"
    | "children.parent.id"
    | "children.parent.parent.id"
    | "children.parent.parent.children"
    | "children.parent.children"
    | "children.parent.children.id"
    | "children.parent.children.children"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.children"
    | "children.children.id"
    | "children.children.parent.id"
    | "children.children.parent.children"
    | "children.children.children"
    | "children.children.children.id"
    | "children.children.children.children"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"

  type DirectoryGroupConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<DirectoryEdge>
    readonly nodes: ReadonlyArray<Directory>
    readonly pageInfo: PageInfo
    readonly field: Scalars["String"]
    readonly fieldValue: Maybe<Scalars["String"]>
  }

  type DirectoryFilterInput = {
    readonly sourceInstanceName: Maybe<StringQueryOperatorInput>
    readonly absolutePath: Maybe<StringQueryOperatorInput>
    readonly relativePath: Maybe<StringQueryOperatorInput>
    readonly extension: Maybe<StringQueryOperatorInput>
    readonly size: Maybe<IntQueryOperatorInput>
    readonly prettySize: Maybe<StringQueryOperatorInput>
    readonly modifiedTime: Maybe<DateQueryOperatorInput>
    readonly accessTime: Maybe<DateQueryOperatorInput>
    readonly changeTime: Maybe<DateQueryOperatorInput>
    readonly birthTime: Maybe<DateQueryOperatorInput>
    readonly root: Maybe<StringQueryOperatorInput>
    readonly dir: Maybe<StringQueryOperatorInput>
    readonly base: Maybe<StringQueryOperatorInput>
    readonly ext: Maybe<StringQueryOperatorInput>
    readonly name: Maybe<StringQueryOperatorInput>
    readonly relativeDirectory: Maybe<StringQueryOperatorInput>
    readonly dev: Maybe<IntQueryOperatorInput>
    readonly mode: Maybe<IntQueryOperatorInput>
    readonly nlink: Maybe<IntQueryOperatorInput>
    readonly uid: Maybe<IntQueryOperatorInput>
    readonly gid: Maybe<IntQueryOperatorInput>
    readonly rdev: Maybe<IntQueryOperatorInput>
    readonly ino: Maybe<FloatQueryOperatorInput>
    readonly atimeMs: Maybe<FloatQueryOperatorInput>
    readonly mtimeMs: Maybe<FloatQueryOperatorInput>
    readonly ctimeMs: Maybe<FloatQueryOperatorInput>
    readonly atime: Maybe<DateQueryOperatorInput>
    readonly mtime: Maybe<DateQueryOperatorInput>
    readonly ctime: Maybe<DateQueryOperatorInput>
    readonly birthtime: Maybe<DateQueryOperatorInput>
    readonly birthtimeMs: Maybe<FloatQueryOperatorInput>
    readonly blksize: Maybe<IntQueryOperatorInput>
    readonly blocks: Maybe<IntQueryOperatorInput>
    readonly id: Maybe<StringQueryOperatorInput>
    readonly parent: Maybe<NodeFilterInput>
    readonly children: Maybe<NodeFilterListInput>
    readonly internal: Maybe<InternalFilterInput>
  }

  type DirectorySortInput = {
    readonly fields: Maybe<ReadonlyArray<Maybe<DirectoryFieldsEnum>>>
    readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>
  }

  type SiteSiteMetadataFilterInput = {
    readonly title: Maybe<StringQueryOperatorInput>
    readonly description: Maybe<StringQueryOperatorInput>
    readonly author: Maybe<StringQueryOperatorInput>
    readonly siteUrl: Maybe<StringQueryOperatorInput>
  }

  type SiteFlagsFilterInput = {
    readonly FAST_DEV: Maybe<BooleanQueryOperatorInput>
    readonly DEV_WEBPACK_CACHE: Maybe<BooleanQueryOperatorInput>
    readonly PARALLEL_SOURCING: Maybe<BooleanQueryOperatorInput>
  }

  type SiteConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<SiteEdge>
    readonly nodes: ReadonlyArray<Site>
    readonly pageInfo: PageInfo
    readonly distinct: ReadonlyArray<Scalars["String"]>
    readonly max: Maybe<Scalars["Float"]>
    readonly min: Maybe<Scalars["Float"]>
    readonly sum: Maybe<Scalars["Float"]>
    readonly group: ReadonlyArray<SiteGroupConnection>
  }

  type SiteConnection_distinctArgs = {
    field: SiteFieldsEnum
  }

  type SiteConnection_maxArgs = {
    field: SiteFieldsEnum
  }

  type SiteConnection_minArgs = {
    field: SiteFieldsEnum
  }

  type SiteConnection_sumArgs = {
    field: SiteFieldsEnum
  }

  type SiteConnection_groupArgs = {
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
    field: SiteFieldsEnum
  }

  type SiteEdge = {
    readonly next: Maybe<Site>
    readonly node: Site
    readonly previous: Maybe<Site>
  }

  type SiteFieldsEnum =
    | "buildTime"
    | "siteMetadata.title"
    | "siteMetadata.description"
    | "siteMetadata.author"
    | "siteMetadata.siteUrl"
    | "port"
    | "host"
    | "flags.FAST_DEV"
    | "flags.DEV_WEBPACK_CACHE"
    | "flags.PARALLEL_SOURCING"
    | "polyfill"
    | "pathPrefix"
    | "id"
    | "parent.id"
    | "parent.parent.id"
    | "parent.parent.parent.id"
    | "parent.parent.parent.children"
    | "parent.parent.children"
    | "parent.parent.children.id"
    | "parent.parent.children.children"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.children"
    | "parent.children.id"
    | "parent.children.parent.id"
    | "parent.children.parent.children"
    | "parent.children.children"
    | "parent.children.children.id"
    | "parent.children.children.children"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "children"
    | "children.id"
    | "children.parent.id"
    | "children.parent.parent.id"
    | "children.parent.parent.children"
    | "children.parent.children"
    | "children.parent.children.id"
    | "children.parent.children.children"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.children"
    | "children.children.id"
    | "children.children.parent.id"
    | "children.children.parent.children"
    | "children.children.children"
    | "children.children.children.id"
    | "children.children.children.children"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"

  type SiteGroupConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<SiteEdge>
    readonly nodes: ReadonlyArray<Site>
    readonly pageInfo: PageInfo
    readonly field: Scalars["String"]
    readonly fieldValue: Maybe<Scalars["String"]>
  }

  type SiteFilterInput = {
    readonly buildTime: Maybe<DateQueryOperatorInput>
    readonly siteMetadata: Maybe<SiteSiteMetadataFilterInput>
    readonly port: Maybe<IntQueryOperatorInput>
    readonly host: Maybe<StringQueryOperatorInput>
    readonly flags: Maybe<SiteFlagsFilterInput>
    readonly polyfill: Maybe<BooleanQueryOperatorInput>
    readonly pathPrefix: Maybe<StringQueryOperatorInput>
    readonly id: Maybe<StringQueryOperatorInput>
    readonly parent: Maybe<NodeFilterInput>
    readonly children: Maybe<NodeFilterListInput>
    readonly internal: Maybe<InternalFilterInput>
  }

  type SiteSortInput = {
    readonly fields: Maybe<ReadonlyArray<Maybe<SiteFieldsEnum>>>
    readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>
  }

  type SiteFunctionConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<SiteFunctionEdge>
    readonly nodes: ReadonlyArray<SiteFunction>
    readonly pageInfo: PageInfo
    readonly distinct: ReadonlyArray<Scalars["String"]>
    readonly max: Maybe<Scalars["Float"]>
    readonly min: Maybe<Scalars["Float"]>
    readonly sum: Maybe<Scalars["Float"]>
    readonly group: ReadonlyArray<SiteFunctionGroupConnection>
  }

  type SiteFunctionConnection_distinctArgs = {
    field: SiteFunctionFieldsEnum
  }

  type SiteFunctionConnection_maxArgs = {
    field: SiteFunctionFieldsEnum
  }

  type SiteFunctionConnection_minArgs = {
    field: SiteFunctionFieldsEnum
  }

  type SiteFunctionConnection_sumArgs = {
    field: SiteFunctionFieldsEnum
  }

  type SiteFunctionConnection_groupArgs = {
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
    field: SiteFunctionFieldsEnum
  }

  type SiteFunctionEdge = {
    readonly next: Maybe<SiteFunction>
    readonly node: SiteFunction
    readonly previous: Maybe<SiteFunction>
  }

  type SiteFunctionFieldsEnum =
    | "functionRoute"
    | "pluginName"
    | "originalAbsoluteFilePath"
    | "originalRelativeFilePath"
    | "relativeCompiledFilePath"
    | "absoluteCompiledFilePath"
    | "matchPath"
    | "id"
    | "parent.id"
    | "parent.parent.id"
    | "parent.parent.parent.id"
    | "parent.parent.parent.children"
    | "parent.parent.children"
    | "parent.parent.children.id"
    | "parent.parent.children.children"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.children"
    | "parent.children.id"
    | "parent.children.parent.id"
    | "parent.children.parent.children"
    | "parent.children.children"
    | "parent.children.children.id"
    | "parent.children.children.children"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "children"
    | "children.id"
    | "children.parent.id"
    | "children.parent.parent.id"
    | "children.parent.parent.children"
    | "children.parent.children"
    | "children.parent.children.id"
    | "children.parent.children.children"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.children"
    | "children.children.id"
    | "children.children.parent.id"
    | "children.children.parent.children"
    | "children.children.children"
    | "children.children.children.id"
    | "children.children.children.children"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"

  type SiteFunctionGroupConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<SiteFunctionEdge>
    readonly nodes: ReadonlyArray<SiteFunction>
    readonly pageInfo: PageInfo
    readonly field: Scalars["String"]
    readonly fieldValue: Maybe<Scalars["String"]>
  }

  type SiteFunctionFilterInput = {
    readonly functionRoute: Maybe<StringQueryOperatorInput>
    readonly pluginName: Maybe<StringQueryOperatorInput>
    readonly originalAbsoluteFilePath: Maybe<StringQueryOperatorInput>
    readonly originalRelativeFilePath: Maybe<StringQueryOperatorInput>
    readonly relativeCompiledFilePath: Maybe<StringQueryOperatorInput>
    readonly absoluteCompiledFilePath: Maybe<StringQueryOperatorInput>
    readonly matchPath: Maybe<StringQueryOperatorInput>
    readonly id: Maybe<StringQueryOperatorInput>
    readonly parent: Maybe<NodeFilterInput>
    readonly children: Maybe<NodeFilterListInput>
    readonly internal: Maybe<InternalFilterInput>
  }

  type SiteFunctionSortInput = {
    readonly fields: Maybe<ReadonlyArray<Maybe<SiteFunctionFieldsEnum>>>
    readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>
  }

  type SitePageContextFilterInput = {
    readonly locale: Maybe<StringQueryOperatorInput>
    readonly hrefLang: Maybe<StringQueryOperatorInput>
    readonly originalPath: Maybe<StringQueryOperatorInput>
    readonly dateFormat: Maybe<StringQueryOperatorInput>
    readonly layout: Maybe<StringQueryOperatorInput>
  }

  type SitePluginFilterInput = {
    readonly id: Maybe<StringQueryOperatorInput>
    readonly parent: Maybe<NodeFilterInput>
    readonly children: Maybe<NodeFilterListInput>
    readonly internal: Maybe<InternalFilterInput>
    readonly resolve: Maybe<StringQueryOperatorInput>
    readonly name: Maybe<StringQueryOperatorInput>
    readonly version: Maybe<StringQueryOperatorInput>
    readonly pluginOptions: Maybe<SitePluginPluginOptionsFilterInput>
    readonly nodeAPIs: Maybe<StringQueryOperatorInput>
    readonly browserAPIs: Maybe<StringQueryOperatorInput>
    readonly ssrAPIs: Maybe<StringQueryOperatorInput>
    readonly pluginFilepath: Maybe<StringQueryOperatorInput>
    readonly packageJson: Maybe<SitePluginPackageJsonFilterInput>
  }

  type SitePluginPluginOptionsFilterInput = {
    readonly name: Maybe<StringQueryOperatorInput>
    readonly path: Maybe<StringQueryOperatorInput>
    readonly base64Width: Maybe<IntQueryOperatorInput>
    readonly stripMetadata: Maybe<BooleanQueryOperatorInput>
    readonly defaultQuality: Maybe<IntQueryOperatorInput>
    readonly failOnError: Maybe<BooleanQueryOperatorInput>
    readonly short_name: Maybe<StringQueryOperatorInput>
    readonly start_url: Maybe<StringQueryOperatorInput>
    readonly background_color: Maybe<StringQueryOperatorInput>
    readonly theme_color: Maybe<StringQueryOperatorInput>
    readonly display: Maybe<StringQueryOperatorInput>
    readonly icon: Maybe<StringQueryOperatorInput>
    readonly icon_options: Maybe<SitePluginPluginOptionsIcon_optionsFilterInput>
    readonly legacy: Maybe<BooleanQueryOperatorInput>
    readonly theme_color_in_head: Maybe<BooleanQueryOperatorInput>
    readonly cache_busting_mode: Maybe<StringQueryOperatorInput>
    readonly crossOrigin: Maybe<StringQueryOperatorInput>
    readonly include_favicon: Maybe<BooleanQueryOperatorInput>
    readonly cacheDigest: Maybe<StringQueryOperatorInput>
    readonly prettier: Maybe<BooleanQueryOperatorInput>
    readonly svgo: Maybe<BooleanQueryOperatorInput>
    readonly svgoConfig: Maybe<SitePluginPluginOptionsSvgoConfigFilterInput>
    readonly siteUrl: Maybe<StringQueryOperatorInput>
    readonly color: Maybe<StringQueryOperatorInput>
    readonly showSpinner: Maybe<BooleanQueryOperatorInput>
    readonly defaultLang: Maybe<StringQueryOperatorInput>
    readonly configPath: Maybe<StringQueryOperatorInput>
    readonly localeDir: Maybe<StringQueryOperatorInput>
    readonly emitSchema: Maybe<SitePluginPluginOptionsEmitSchemaFilterInput>
    readonly pathCheck: Maybe<BooleanQueryOperatorInput>
    readonly allExtensions: Maybe<BooleanQueryOperatorInput>
    readonly isTSX: Maybe<BooleanQueryOperatorInput>
    readonly jsxPragma: Maybe<StringQueryOperatorInput>
  }

  type SitePluginPluginOptionsIcon_optionsFilterInput = {
    readonly purpose: Maybe<StringQueryOperatorInput>
  }

  type SitePluginPluginOptionsSvgoConfigFilterInput = {
    readonly removeViewBox: Maybe<BooleanQueryOperatorInput>
    readonly cleanupIDs: Maybe<BooleanQueryOperatorInput>
  }

  type SitePluginPluginOptionsEmitSchemaFilterInput = {
    readonly src___generated___gatsby_schema_graphql: Maybe<BooleanQueryOperatorInput>
  }

  type SitePluginPackageJsonFilterInput = {
    readonly name: Maybe<StringQueryOperatorInput>
    readonly description: Maybe<StringQueryOperatorInput>
    readonly version: Maybe<StringQueryOperatorInput>
    readonly main: Maybe<StringQueryOperatorInput>
    readonly license: Maybe<StringQueryOperatorInput>
    readonly dependencies: Maybe<SitePluginPackageJsonDependenciesFilterListInput>
    readonly devDependencies: Maybe<SitePluginPackageJsonDevDependenciesFilterListInput>
    readonly peerDependencies: Maybe<SitePluginPackageJsonPeerDependenciesFilterListInput>
    readonly keywords: Maybe<StringQueryOperatorInput>
  }

  type SitePluginPackageJsonDependenciesFilterListInput = {
    readonly elemMatch: Maybe<SitePluginPackageJsonDependenciesFilterInput>
  }

  type SitePluginPackageJsonDependenciesFilterInput = {
    readonly name: Maybe<StringQueryOperatorInput>
    readonly version: Maybe<StringQueryOperatorInput>
  }

  type SitePluginPackageJsonDevDependenciesFilterListInput = {
    readonly elemMatch: Maybe<SitePluginPackageJsonDevDependenciesFilterInput>
  }

  type SitePluginPackageJsonDevDependenciesFilterInput = {
    readonly name: Maybe<StringQueryOperatorInput>
    readonly version: Maybe<StringQueryOperatorInput>
  }

  type SitePluginPackageJsonPeerDependenciesFilterListInput = {
    readonly elemMatch: Maybe<SitePluginPackageJsonPeerDependenciesFilterInput>
  }

  type SitePluginPackageJsonPeerDependenciesFilterInput = {
    readonly name: Maybe<StringQueryOperatorInput>
    readonly version: Maybe<StringQueryOperatorInput>
  }

  type SitePageConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<SitePageEdge>
    readonly nodes: ReadonlyArray<SitePage>
    readonly pageInfo: PageInfo
    readonly distinct: ReadonlyArray<Scalars["String"]>
    readonly max: Maybe<Scalars["Float"]>
    readonly min: Maybe<Scalars["Float"]>
    readonly sum: Maybe<Scalars["Float"]>
    readonly group: ReadonlyArray<SitePageGroupConnection>
  }

  type SitePageConnection_distinctArgs = {
    field: SitePageFieldsEnum
  }

  type SitePageConnection_maxArgs = {
    field: SitePageFieldsEnum
  }

  type SitePageConnection_minArgs = {
    field: SitePageFieldsEnum
  }

  type SitePageConnection_sumArgs = {
    field: SitePageFieldsEnum
  }

  type SitePageConnection_groupArgs = {
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
    field: SitePageFieldsEnum
  }

  type SitePageEdge = {
    readonly next: Maybe<SitePage>
    readonly node: SitePage
    readonly previous: Maybe<SitePage>
  }

  type SitePageFieldsEnum =
    | "path"
    | "component"
    | "internalComponentName"
    | "componentChunkName"
    | "matchPath"
    | "id"
    | "parent.id"
    | "parent.parent.id"
    | "parent.parent.parent.id"
    | "parent.parent.parent.children"
    | "parent.parent.children"
    | "parent.parent.children.id"
    | "parent.parent.children.children"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.children"
    | "parent.children.id"
    | "parent.children.parent.id"
    | "parent.children.parent.children"
    | "parent.children.children"
    | "parent.children.children.id"
    | "parent.children.children.children"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "children"
    | "children.id"
    | "children.parent.id"
    | "children.parent.parent.id"
    | "children.parent.parent.children"
    | "children.parent.children"
    | "children.parent.children.id"
    | "children.parent.children.children"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.children"
    | "children.children.id"
    | "children.children.parent.id"
    | "children.children.parent.children"
    | "children.children.children"
    | "children.children.children.id"
    | "children.children.children.children"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"
    | "isCreatedByStatefulCreatePages"
    | "context.locale"
    | "context.hrefLang"
    | "context.originalPath"
    | "context.dateFormat"
    | "context.layout"
    | "pluginCreator.id"
    | "pluginCreator.parent.id"
    | "pluginCreator.parent.parent.id"
    | "pluginCreator.parent.parent.children"
    | "pluginCreator.parent.children"
    | "pluginCreator.parent.children.id"
    | "pluginCreator.parent.children.children"
    | "pluginCreator.parent.internal.content"
    | "pluginCreator.parent.internal.contentDigest"
    | "pluginCreator.parent.internal.description"
    | "pluginCreator.parent.internal.fieldOwners"
    | "pluginCreator.parent.internal.ignoreType"
    | "pluginCreator.parent.internal.mediaType"
    | "pluginCreator.parent.internal.owner"
    | "pluginCreator.parent.internal.type"
    | "pluginCreator.children"
    | "pluginCreator.children.id"
    | "pluginCreator.children.parent.id"
    | "pluginCreator.children.parent.children"
    | "pluginCreator.children.children"
    | "pluginCreator.children.children.id"
    | "pluginCreator.children.children.children"
    | "pluginCreator.children.internal.content"
    | "pluginCreator.children.internal.contentDigest"
    | "pluginCreator.children.internal.description"
    | "pluginCreator.children.internal.fieldOwners"
    | "pluginCreator.children.internal.ignoreType"
    | "pluginCreator.children.internal.mediaType"
    | "pluginCreator.children.internal.owner"
    | "pluginCreator.children.internal.type"
    | "pluginCreator.internal.content"
    | "pluginCreator.internal.contentDigest"
    | "pluginCreator.internal.description"
    | "pluginCreator.internal.fieldOwners"
    | "pluginCreator.internal.ignoreType"
    | "pluginCreator.internal.mediaType"
    | "pluginCreator.internal.owner"
    | "pluginCreator.internal.type"
    | "pluginCreator.resolve"
    | "pluginCreator.name"
    | "pluginCreator.version"
    | "pluginCreator.pluginOptions.name"
    | "pluginCreator.pluginOptions.path"
    | "pluginCreator.pluginOptions.base64Width"
    | "pluginCreator.pluginOptions.stripMetadata"
    | "pluginCreator.pluginOptions.defaultQuality"
    | "pluginCreator.pluginOptions.failOnError"
    | "pluginCreator.pluginOptions.short_name"
    | "pluginCreator.pluginOptions.start_url"
    | "pluginCreator.pluginOptions.background_color"
    | "pluginCreator.pluginOptions.theme_color"
    | "pluginCreator.pluginOptions.display"
    | "pluginCreator.pluginOptions.icon"
    | "pluginCreator.pluginOptions.icon_options.purpose"
    | "pluginCreator.pluginOptions.legacy"
    | "pluginCreator.pluginOptions.theme_color_in_head"
    | "pluginCreator.pluginOptions.cache_busting_mode"
    | "pluginCreator.pluginOptions.crossOrigin"
    | "pluginCreator.pluginOptions.include_favicon"
    | "pluginCreator.pluginOptions.cacheDigest"
    | "pluginCreator.pluginOptions.prettier"
    | "pluginCreator.pluginOptions.svgo"
    | "pluginCreator.pluginOptions.svgoConfig.removeViewBox"
    | "pluginCreator.pluginOptions.svgoConfig.cleanupIDs"
    | "pluginCreator.pluginOptions.siteUrl"
    | "pluginCreator.pluginOptions.color"
    | "pluginCreator.pluginOptions.showSpinner"
    | "pluginCreator.pluginOptions.defaultLang"
    | "pluginCreator.pluginOptions.configPath"
    | "pluginCreator.pluginOptions.localeDir"
    | "pluginCreator.pluginOptions.emitSchema.src___generated___gatsby_schema_graphql"
    | "pluginCreator.pluginOptions.pathCheck"
    | "pluginCreator.pluginOptions.allExtensions"
    | "pluginCreator.pluginOptions.isTSX"
    | "pluginCreator.pluginOptions.jsxPragma"
    | "pluginCreator.nodeAPIs"
    | "pluginCreator.browserAPIs"
    | "pluginCreator.ssrAPIs"
    | "pluginCreator.pluginFilepath"
    | "pluginCreator.packageJson.name"
    | "pluginCreator.packageJson.description"
    | "pluginCreator.packageJson.version"
    | "pluginCreator.packageJson.main"
    | "pluginCreator.packageJson.license"
    | "pluginCreator.packageJson.dependencies"
    | "pluginCreator.packageJson.dependencies.name"
    | "pluginCreator.packageJson.dependencies.version"
    | "pluginCreator.packageJson.devDependencies"
    | "pluginCreator.packageJson.devDependencies.name"
    | "pluginCreator.packageJson.devDependencies.version"
    | "pluginCreator.packageJson.peerDependencies"
    | "pluginCreator.packageJson.peerDependencies.name"
    | "pluginCreator.packageJson.peerDependencies.version"
    | "pluginCreator.packageJson.keywords"
    | "pluginCreatorId"

  type SitePageGroupConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<SitePageEdge>
    readonly nodes: ReadonlyArray<SitePage>
    readonly pageInfo: PageInfo
    readonly field: Scalars["String"]
    readonly fieldValue: Maybe<Scalars["String"]>
  }

  type SitePageFilterInput = {
    readonly path: Maybe<StringQueryOperatorInput>
    readonly component: Maybe<StringQueryOperatorInput>
    readonly internalComponentName: Maybe<StringQueryOperatorInput>
    readonly componentChunkName: Maybe<StringQueryOperatorInput>
    readonly matchPath: Maybe<StringQueryOperatorInput>
    readonly id: Maybe<StringQueryOperatorInput>
    readonly parent: Maybe<NodeFilterInput>
    readonly children: Maybe<NodeFilterListInput>
    readonly internal: Maybe<InternalFilterInput>
    readonly isCreatedByStatefulCreatePages: Maybe<BooleanQueryOperatorInput>
    readonly context: Maybe<SitePageContextFilterInput>
    readonly pluginCreator: Maybe<SitePluginFilterInput>
    readonly pluginCreatorId: Maybe<StringQueryOperatorInput>
  }

  type SitePageSortInput = {
    readonly fields: Maybe<ReadonlyArray<Maybe<SitePageFieldsEnum>>>
    readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>
  }

  type ThemeUiConfigConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<ThemeUiConfigEdge>
    readonly nodes: ReadonlyArray<ThemeUiConfig>
    readonly pageInfo: PageInfo
    readonly distinct: ReadonlyArray<Scalars["String"]>
    readonly max: Maybe<Scalars["Float"]>
    readonly min: Maybe<Scalars["Float"]>
    readonly sum: Maybe<Scalars["Float"]>
    readonly group: ReadonlyArray<ThemeUiConfigGroupConnection>
  }

  type ThemeUiConfigConnection_distinctArgs = {
    field: ThemeUiConfigFieldsEnum
  }

  type ThemeUiConfigConnection_maxArgs = {
    field: ThemeUiConfigFieldsEnum
  }

  type ThemeUiConfigConnection_minArgs = {
    field: ThemeUiConfigFieldsEnum
  }

  type ThemeUiConfigConnection_sumArgs = {
    field: ThemeUiConfigFieldsEnum
  }

  type ThemeUiConfigConnection_groupArgs = {
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
    field: ThemeUiConfigFieldsEnum
  }

  type ThemeUiConfigEdge = {
    readonly next: Maybe<ThemeUiConfig>
    readonly node: ThemeUiConfig
    readonly previous: Maybe<ThemeUiConfig>
  }

  type ThemeUiConfigFieldsEnum =
    | "preset"
    | "prismPreset"
    | "id"
    | "parent.id"
    | "parent.parent.id"
    | "parent.parent.parent.id"
    | "parent.parent.parent.children"
    | "parent.parent.children"
    | "parent.parent.children.id"
    | "parent.parent.children.children"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.children"
    | "parent.children.id"
    | "parent.children.parent.id"
    | "parent.children.parent.children"
    | "parent.children.children"
    | "parent.children.children.id"
    | "parent.children.children.children"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "children"
    | "children.id"
    | "children.parent.id"
    | "children.parent.parent.id"
    | "children.parent.parent.children"
    | "children.parent.children"
    | "children.parent.children.id"
    | "children.parent.children.children"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.children"
    | "children.children.id"
    | "children.children.parent.id"
    | "children.children.parent.children"
    | "children.children.children"
    | "children.children.children.id"
    | "children.children.children.children"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"

  type ThemeUiConfigGroupConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<ThemeUiConfigEdge>
    readonly nodes: ReadonlyArray<ThemeUiConfig>
    readonly pageInfo: PageInfo
    readonly field: Scalars["String"]
    readonly fieldValue: Maybe<Scalars["String"]>
  }

  type ThemeUiConfigFilterInput = {
    readonly preset: Maybe<JSONQueryOperatorInput>
    readonly prismPreset: Maybe<JSONQueryOperatorInput>
    readonly id: Maybe<StringQueryOperatorInput>
    readonly parent: Maybe<NodeFilterInput>
    readonly children: Maybe<NodeFilterListInput>
    readonly internal: Maybe<InternalFilterInput>
  }

  type ThemeUiConfigSortInput = {
    readonly fields: Maybe<ReadonlyArray<Maybe<ThemeUiConfigFieldsEnum>>>
    readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>
  }

  type ImageSharpConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<ImageSharpEdge>
    readonly nodes: ReadonlyArray<ImageSharp>
    readonly pageInfo: PageInfo
    readonly distinct: ReadonlyArray<Scalars["String"]>
    readonly max: Maybe<Scalars["Float"]>
    readonly min: Maybe<Scalars["Float"]>
    readonly sum: Maybe<Scalars["Float"]>
    readonly group: ReadonlyArray<ImageSharpGroupConnection>
  }

  type ImageSharpConnection_distinctArgs = {
    field: ImageSharpFieldsEnum
  }

  type ImageSharpConnection_maxArgs = {
    field: ImageSharpFieldsEnum
  }

  type ImageSharpConnection_minArgs = {
    field: ImageSharpFieldsEnum
  }

  type ImageSharpConnection_sumArgs = {
    field: ImageSharpFieldsEnum
  }

  type ImageSharpConnection_groupArgs = {
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
    field: ImageSharpFieldsEnum
  }

  type ImageSharpEdge = {
    readonly next: Maybe<ImageSharp>
    readonly node: ImageSharp
    readonly previous: Maybe<ImageSharp>
  }

  type ImageSharpFieldsEnum =
    | "fixed.base64"
    | "fixed.tracedSVG"
    | "fixed.aspectRatio"
    | "fixed.width"
    | "fixed.height"
    | "fixed.src"
    | "fixed.srcSet"
    | "fixed.srcWebp"
    | "fixed.srcSetWebp"
    | "fixed.originalName"
    | "fluid.base64"
    | "fluid.tracedSVG"
    | "fluid.aspectRatio"
    | "fluid.src"
    | "fluid.srcSet"
    | "fluid.srcWebp"
    | "fluid.srcSetWebp"
    | "fluid.sizes"
    | "fluid.originalImg"
    | "fluid.originalName"
    | "fluid.presentationWidth"
    | "fluid.presentationHeight"
    | "gatsbyImageData"
    | "original.width"
    | "original.height"
    | "original.src"
    | "resize.src"
    | "resize.tracedSVG"
    | "resize.width"
    | "resize.height"
    | "resize.aspectRatio"
    | "resize.originalName"
    | "id"
    | "parent.id"
    | "parent.parent.id"
    | "parent.parent.parent.id"
    | "parent.parent.parent.children"
    | "parent.parent.children"
    | "parent.parent.children.id"
    | "parent.parent.children.children"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.children"
    | "parent.children.id"
    | "parent.children.parent.id"
    | "parent.children.parent.children"
    | "parent.children.children"
    | "parent.children.children.id"
    | "parent.children.children.children"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "children"
    | "children.id"
    | "children.parent.id"
    | "children.parent.parent.id"
    | "children.parent.parent.children"
    | "children.parent.children"
    | "children.parent.children.id"
    | "children.parent.children.children"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.children"
    | "children.children.id"
    | "children.children.parent.id"
    | "children.children.parent.children"
    | "children.children.children"
    | "children.children.children.id"
    | "children.children.children.children"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"

  type ImageSharpGroupConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<ImageSharpEdge>
    readonly nodes: ReadonlyArray<ImageSharp>
    readonly pageInfo: PageInfo
    readonly field: Scalars["String"]
    readonly fieldValue: Maybe<Scalars["String"]>
  }

  type ImageSharpSortInput = {
    readonly fields: Maybe<ReadonlyArray<Maybe<ImageSharpFieldsEnum>>>
    readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>
  }

  type LocaleFilterListInput = {
    readonly elemMatch: Maybe<LocaleFilterInput>
  }

  type LocaleFilterInput = {
    readonly code: Maybe<StringQueryOperatorInput>
    readonly hrefLang: Maybe<StringQueryOperatorInput>
    readonly dateFormat: Maybe<StringQueryOperatorInput>
    readonly langDir: Maybe<StringQueryOperatorInput>
    readonly localName: Maybe<StringQueryOperatorInput>
    readonly name: Maybe<StringQueryOperatorInput>
  }

  type ThemeI18nConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<ThemeI18nEdge>
    readonly nodes: ReadonlyArray<ThemeI18n>
    readonly pageInfo: PageInfo
    readonly distinct: ReadonlyArray<Scalars["String"]>
    readonly max: Maybe<Scalars["Float"]>
    readonly min: Maybe<Scalars["Float"]>
    readonly sum: Maybe<Scalars["Float"]>
    readonly group: ReadonlyArray<ThemeI18nGroupConnection>
  }

  type ThemeI18nConnection_distinctArgs = {
    field: ThemeI18nFieldsEnum
  }

  type ThemeI18nConnection_maxArgs = {
    field: ThemeI18nFieldsEnum
  }

  type ThemeI18nConnection_minArgs = {
    field: ThemeI18nFieldsEnum
  }

  type ThemeI18nConnection_sumArgs = {
    field: ThemeI18nFieldsEnum
  }

  type ThemeI18nConnection_groupArgs = {
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
    field: ThemeI18nFieldsEnum
  }

  type ThemeI18nEdge = {
    readonly next: Maybe<ThemeI18n>
    readonly node: ThemeI18n
    readonly previous: Maybe<ThemeI18n>
  }

  type ThemeI18nFieldsEnum =
    | "defaultLang"
    | "prefixDefault"
    | "configPath"
    | "config"
    | "config.code"
    | "config.hrefLang"
    | "config.dateFormat"
    | "config.langDir"
    | "config.localName"
    | "config.name"
    | "id"
    | "parent.id"
    | "parent.parent.id"
    | "parent.parent.parent.id"
    | "parent.parent.parent.children"
    | "parent.parent.children"
    | "parent.parent.children.id"
    | "parent.parent.children.children"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.children"
    | "parent.children.id"
    | "parent.children.parent.id"
    | "parent.children.parent.children"
    | "parent.children.children"
    | "parent.children.children.id"
    | "parent.children.children.children"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "children"
    | "children.id"
    | "children.parent.id"
    | "children.parent.parent.id"
    | "children.parent.parent.children"
    | "children.parent.children"
    | "children.parent.children.id"
    | "children.parent.children.children"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.children"
    | "children.children.id"
    | "children.children.parent.id"
    | "children.children.parent.children"
    | "children.children.children"
    | "children.children.children.id"
    | "children.children.children.children"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"

  type ThemeI18nGroupConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<ThemeI18nEdge>
    readonly nodes: ReadonlyArray<ThemeI18n>
    readonly pageInfo: PageInfo
    readonly field: Scalars["String"]
    readonly fieldValue: Maybe<Scalars["String"]>
  }

  type ThemeI18nFilterInput = {
    readonly defaultLang: Maybe<StringQueryOperatorInput>
    readonly prefixDefault: Maybe<BooleanQueryOperatorInput>
    readonly configPath: Maybe<StringQueryOperatorInput>
    readonly config: Maybe<LocaleFilterListInput>
    readonly id: Maybe<StringQueryOperatorInput>
    readonly parent: Maybe<NodeFilterInput>
    readonly children: Maybe<NodeFilterListInput>
    readonly internal: Maybe<InternalFilterInput>
  }

  type ThemeI18nSortInput = {
    readonly fields: Maybe<ReadonlyArray<Maybe<ThemeI18nFieldsEnum>>>
    readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>
  }

  type SitePluginConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<SitePluginEdge>
    readonly nodes: ReadonlyArray<SitePlugin>
    readonly pageInfo: PageInfo
    readonly distinct: ReadonlyArray<Scalars["String"]>
    readonly max: Maybe<Scalars["Float"]>
    readonly min: Maybe<Scalars["Float"]>
    readonly sum: Maybe<Scalars["Float"]>
    readonly group: ReadonlyArray<SitePluginGroupConnection>
  }

  type SitePluginConnection_distinctArgs = {
    field: SitePluginFieldsEnum
  }

  type SitePluginConnection_maxArgs = {
    field: SitePluginFieldsEnum
  }

  type SitePluginConnection_minArgs = {
    field: SitePluginFieldsEnum
  }

  type SitePluginConnection_sumArgs = {
    field: SitePluginFieldsEnum
  }

  type SitePluginConnection_groupArgs = {
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
    field: SitePluginFieldsEnum
  }

  type SitePluginEdge = {
    readonly next: Maybe<SitePlugin>
    readonly node: SitePlugin
    readonly previous: Maybe<SitePlugin>
  }

  type SitePluginFieldsEnum =
    | "id"
    | "parent.id"
    | "parent.parent.id"
    | "parent.parent.parent.id"
    | "parent.parent.parent.children"
    | "parent.parent.children"
    | "parent.parent.children.id"
    | "parent.parent.children.children"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.children"
    | "parent.children.id"
    | "parent.children.parent.id"
    | "parent.children.parent.children"
    | "parent.children.children"
    | "parent.children.children.id"
    | "parent.children.children.children"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "children"
    | "children.id"
    | "children.parent.id"
    | "children.parent.parent.id"
    | "children.parent.parent.children"
    | "children.parent.children"
    | "children.parent.children.id"
    | "children.parent.children.children"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.children"
    | "children.children.id"
    | "children.children.parent.id"
    | "children.children.parent.children"
    | "children.children.children"
    | "children.children.children.id"
    | "children.children.children.children"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"
    | "resolve"
    | "name"
    | "version"
    | "pluginOptions.name"
    | "pluginOptions.path"
    | "pluginOptions.base64Width"
    | "pluginOptions.stripMetadata"
    | "pluginOptions.defaultQuality"
    | "pluginOptions.failOnError"
    | "pluginOptions.short_name"
    | "pluginOptions.start_url"
    | "pluginOptions.background_color"
    | "pluginOptions.theme_color"
    | "pluginOptions.display"
    | "pluginOptions.icon"
    | "pluginOptions.icon_options.purpose"
    | "pluginOptions.legacy"
    | "pluginOptions.theme_color_in_head"
    | "pluginOptions.cache_busting_mode"
    | "pluginOptions.crossOrigin"
    | "pluginOptions.include_favicon"
    | "pluginOptions.cacheDigest"
    | "pluginOptions.prettier"
    | "pluginOptions.svgo"
    | "pluginOptions.svgoConfig.removeViewBox"
    | "pluginOptions.svgoConfig.cleanupIDs"
    | "pluginOptions.siteUrl"
    | "pluginOptions.color"
    | "pluginOptions.showSpinner"
    | "pluginOptions.defaultLang"
    | "pluginOptions.configPath"
    | "pluginOptions.localeDir"
    | "pluginOptions.emitSchema.src___generated___gatsby_schema_graphql"
    | "pluginOptions.pathCheck"
    | "pluginOptions.allExtensions"
    | "pluginOptions.isTSX"
    | "pluginOptions.jsxPragma"
    | "nodeAPIs"
    | "browserAPIs"
    | "ssrAPIs"
    | "pluginFilepath"
    | "packageJson.name"
    | "packageJson.description"
    | "packageJson.version"
    | "packageJson.main"
    | "packageJson.license"
    | "packageJson.dependencies"
    | "packageJson.dependencies.name"
    | "packageJson.dependencies.version"
    | "packageJson.devDependencies"
    | "packageJson.devDependencies.name"
    | "packageJson.devDependencies.version"
    | "packageJson.peerDependencies"
    | "packageJson.peerDependencies.name"
    | "packageJson.peerDependencies.version"
    | "packageJson.keywords"

  type SitePluginGroupConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<SitePluginEdge>
    readonly nodes: ReadonlyArray<SitePlugin>
    readonly pageInfo: PageInfo
    readonly field: Scalars["String"]
    readonly fieldValue: Maybe<Scalars["String"]>
  }

  type SitePluginSortInput = {
    readonly fields: Maybe<ReadonlyArray<Maybe<SitePluginFieldsEnum>>>
    readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>
  }

  type SiteBuildMetadataConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<SiteBuildMetadataEdge>
    readonly nodes: ReadonlyArray<SiteBuildMetadata>
    readonly pageInfo: PageInfo
    readonly distinct: ReadonlyArray<Scalars["String"]>
    readonly max: Maybe<Scalars["Float"]>
    readonly min: Maybe<Scalars["Float"]>
    readonly sum: Maybe<Scalars["Float"]>
    readonly group: ReadonlyArray<SiteBuildMetadataGroupConnection>
  }

  type SiteBuildMetadataConnection_distinctArgs = {
    field: SiteBuildMetadataFieldsEnum
  }

  type SiteBuildMetadataConnection_maxArgs = {
    field: SiteBuildMetadataFieldsEnum
  }

  type SiteBuildMetadataConnection_minArgs = {
    field: SiteBuildMetadataFieldsEnum
  }

  type SiteBuildMetadataConnection_sumArgs = {
    field: SiteBuildMetadataFieldsEnum
  }

  type SiteBuildMetadataConnection_groupArgs = {
    skip: Maybe<Scalars["Int"]>
    limit: Maybe<Scalars["Int"]>
    field: SiteBuildMetadataFieldsEnum
  }

  type SiteBuildMetadataEdge = {
    readonly next: Maybe<SiteBuildMetadata>
    readonly node: SiteBuildMetadata
    readonly previous: Maybe<SiteBuildMetadata>
  }

  type SiteBuildMetadataFieldsEnum =
    | "id"
    | "parent.id"
    | "parent.parent.id"
    | "parent.parent.parent.id"
    | "parent.parent.parent.children"
    | "parent.parent.children"
    | "parent.parent.children.id"
    | "parent.parent.children.children"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.children"
    | "parent.children.id"
    | "parent.children.parent.id"
    | "parent.children.parent.children"
    | "parent.children.children"
    | "parent.children.children.id"
    | "parent.children.children.children"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "children"
    | "children.id"
    | "children.parent.id"
    | "children.parent.parent.id"
    | "children.parent.parent.children"
    | "children.parent.children"
    | "children.parent.children.id"
    | "children.parent.children.children"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.children"
    | "children.children.id"
    | "children.children.parent.id"
    | "children.children.parent.children"
    | "children.children.children"
    | "children.children.children.id"
    | "children.children.children.children"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"
    | "buildTime"

  type SiteBuildMetadataGroupConnection = {
    readonly totalCount: Scalars["Int"]
    readonly edges: ReadonlyArray<SiteBuildMetadataEdge>
    readonly nodes: ReadonlyArray<SiteBuildMetadata>
    readonly pageInfo: PageInfo
    readonly field: Scalars["String"]
    readonly fieldValue: Maybe<Scalars["String"]>
  }

  type SiteBuildMetadataFilterInput = {
    readonly id: Maybe<StringQueryOperatorInput>
    readonly parent: Maybe<NodeFilterInput>
    readonly children: Maybe<NodeFilterListInput>
    readonly internal: Maybe<InternalFilterInput>
    readonly buildTime: Maybe<DateQueryOperatorInput>
  }

  type SiteBuildMetadataSortInput = {
    readonly fields: Maybe<ReadonlyArray<Maybe<SiteBuildMetadataFieldsEnum>>>
    readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>
  }

  type homechrisintSrcobserfyappsvorfrontendsrccomponentsseoTsx63159454QueryVariables =
    Exact<{ [key: string]: never }>

  type homechrisintSrcobserfyappsvorfrontendsrccomponentsseoTsx63159454Query = {
    readonly site: Maybe<{
      readonly siteMetadata: Maybe<
        Pick<SiteSiteMetadata, "title" | "description" | "author">
      >
    }>
  }

  type homechrisintSrcobserfynodeModulesgatsbyPluginThemeUisrchooksconfigOptionsJs2744905544QueryVariables =
    Exact<{ [key: string]: never }>

  type homechrisintSrcobserfynodeModulesgatsbyPluginThemeUisrchooksconfigOptionsJs2744905544Query =
    {
      readonly themeUiConfig: Maybe<
        Pick<ThemeUiConfig, "preset" | "prismPreset">
      >
    }

  type GatsbyImageSharpFixedFragment = Pick<
    ImageSharpFixed,
    "base64" | "width" | "height" | "src" | "srcSet"
  >

  type GatsbyImageSharpFixed_tracedSVGFragment = Pick<
    ImageSharpFixed,
    "tracedSVG" | "width" | "height" | "src" | "srcSet"
  >

  type GatsbyImageSharpFixed_withWebpFragment = Pick<
    ImageSharpFixed,
    "base64" | "width" | "height" | "src" | "srcSet" | "srcWebp" | "srcSetWebp"
  >

  type GatsbyImageSharpFixed_withWebp_tracedSVGFragment = Pick<
    ImageSharpFixed,
    | "tracedSVG"
    | "width"
    | "height"
    | "src"
    | "srcSet"
    | "srcWebp"
    | "srcSetWebp"
  >

  type GatsbyImageSharpFixed_noBase64Fragment = Pick<
    ImageSharpFixed,
    "width" | "height" | "src" | "srcSet"
  >

  type GatsbyImageSharpFixed_withWebp_noBase64Fragment = Pick<
    ImageSharpFixed,
    "width" | "height" | "src" | "srcSet" | "srcWebp" | "srcSetWebp"
  >

  type GatsbyImageSharpFluidFragment = Pick<
    ImageSharpFluid,
    "base64" | "aspectRatio" | "src" | "srcSet" | "sizes"
  >

  type GatsbyImageSharpFluidLimitPresentationSizeFragment = {
    maxHeight: ImageSharpFluid["presentationHeight"]
    maxWidth: ImageSharpFluid["presentationWidth"]
  }

  type GatsbyImageSharpFluid_tracedSVGFragment = Pick<
    ImageSharpFluid,
    "tracedSVG" | "aspectRatio" | "src" | "srcSet" | "sizes"
  >

  type GatsbyImageSharpFluid_withWebpFragment = Pick<
    ImageSharpFluid,
    | "base64"
    | "aspectRatio"
    | "src"
    | "srcSet"
    | "srcWebp"
    | "srcSetWebp"
    | "sizes"
  >

  type GatsbyImageSharpFluid_withWebp_tracedSVGFragment = Pick<
    ImageSharpFluid,
    | "tracedSVG"
    | "aspectRatio"
    | "src"
    | "srcSet"
    | "srcWebp"
    | "srcSetWebp"
    | "sizes"
  >

  type GatsbyImageSharpFluid_noBase64Fragment = Pick<
    ImageSharpFluid,
    "aspectRatio" | "src" | "srcSet" | "sizes"
  >

  type GatsbyImageSharpFluid_withWebp_noBase64Fragment = Pick<
    ImageSharpFluid,
    "aspectRatio" | "src" | "srcSet" | "srcWebp" | "srcSetWebp" | "sizes"
  >

  type LocalizationSEOQueryQueryVariables = Exact<{ [key: string]: never }>

  type LocalizationSEOQueryQuery = {
    readonly site: Maybe<{
      readonly siteMetadata: Maybe<Pick<SiteSiteMetadata, "siteUrl">>
    }>
  }

  type LocalizationConfigQueryQueryVariables = Exact<{ [key: string]: never }>

  type LocalizationConfigQueryQuery = {
    readonly themeI18N: Maybe<
      Pick<ThemeI18n, "defaultLang" | "prefixDefault"> & {
        readonly config: Maybe<
          ReadonlyArray<
            Maybe<
              Pick<
                Locale,
                | "code"
                | "hrefLang"
                | "dateFormat"
                | "langDir"
                | "localName"
                | "name"
              >
            >
          >
        >
      }
    >
  }

  type PagesQueryQueryVariables = Exact<{ [key: string]: never }>

  type PagesQueryQuery = {
    readonly allSiteFunction: {
      readonly nodes: ReadonlyArray<Pick<SiteFunction, "functionRoute">>
    }
    readonly allSitePage: {
      readonly nodes: ReadonlyArray<Pick<SitePage, "path">>
    }
  }
}
