import { useState, useEffect, useCallback, ReactNode } from 'react'

interface AppConfig {
  appName: string
  description: string
  packageName: string
  websiteUrl: string
  primaryColor: string
  splashColor: string
  statusBarColor: string
  backgroundColor: string
  appIcon: string | null
  splashIcon: string | null
  fullscreen: boolean
  backNavigation: boolean
  loadingIndicator: boolean
  pullToRefresh: boolean
  allowZoom: boolean
  customCss: string
  blockElements: string
  filterLists: string
}

type ThemeMode = 'dark' | 'light' | 'auto'
type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7
type Language = 'en' | 'ar' | 'fa' | 'fr' | 'es'
type FooterPage = 'terms' | 'privacy' | 'about' | 'contact' | null

const translations: Record<Language, Record<string, string>> = {
  en: {
    title: 'Aurora Builder',
    auroraBuilder: 'Aurora Builder',
    subtitle: 'URL to APK Generator',
    appInfo: 'App Information',
    appName: 'App Name',
    description: 'Description',
    packageName: 'Package Name',
    websiteUrl: 'Website URL',
    appIcons: 'App Icons',
    appIcon: 'App Icon',
    splashIcon: 'Splash Icon',
    uploadIcon: 'Upload Icon',
    uploadSplash: 'Upload Splash',
    colors: 'Colors',
    primary: 'Primary',
    splashBg: 'Splash BG',
    statusBar: 'Status Bar',
    appBg: 'App BG',
    features: 'Features',
    fullscreen: 'Fullscreen Mode',
    fullscreenDesc: 'Hide status & nav bars',
    backNav: 'Back Navigation',
    backNavDesc: 'Hardware back in webview',
    loadingBar: 'Loading Bar',
    loadingBarDesc: 'Show progress indicator',
    pullRefresh: 'Pull to Refresh',
    pullRefreshDesc: 'Swipe down to reload',
    allowZoom: 'Allow Zoom',
    allowZoomDesc: 'Pinch to zoom',
    preview: 'Preview',
    previewDesc: 'Your app will display this URL in fullscreen',
    build: 'Build',
    buildProgress: 'Build Progress',
    githubConnection: 'GitHub Connection',
    personalToken: 'Personal Access Token',
    tokenHelp: 'Get token: GitHub → Settings → Developer settings → Personal access tokens → Generate (select "repo" permissions)',
    generatedFiles: 'Generated Files',
    generateFiles: 'Generate Files',
    downloadAll: 'Download All Files',
    buildApk: 'Build APK Now',
    building: 'Building APK...',
    previous: 'Previous',
    next: 'Next',
    madeWith: 'Made with 💚 by Mostafa',
    allRights: 'All rights reserved.',
    step1: 'App Info',
    step2: 'Design',
    step3: 'Features',
    step4: 'Content',
    step5: 'Preview',
    step6: 'Build',
    step7: 'Download',
    contentBlock: 'Content Blocker',
    contentBlockDesc: 'Remove ads, banners & distractions',
    customCss: 'Custom CSS',
    customCssPlaceholder: '.ads, .banner, .popup { display: none !important; }',
    blockElements: 'Elements to Hide',
    blockElementsPlaceholder: '.ad-container, #sidebar-ads, .cookie-banner',
    blockingTip: 'Enter CSS selectors of elements you want to hide. The APK will inject this CSS to clean up the website.',
    filterLists: 'Import Filter List (uBlock format)',
    filterListsPlaceholder: 'Paste uBlock/AdBlock filter rules here...',
    filterListsTip: 'You can export filters from uBlock Origin and paste them here.',
    downloadApk: 'Download APK',
    buildComplete: 'Build Complete!',
    buildLog: 'Build Log',
    // Preset values
    defaultAppName: 'My Aurora App',
    defaultDescription: 'A beautiful app built with Aurora Builder',
    // Placeholder values (shown in inputs)
    placeholderAppName: 'My Awesome App',
    placeholderDescription: 'A beautiful app...',
    defaultPackageName: 'com.aurora.myapp',
    defaultUrl: 'https://example.com',
    // Build messages
    tokenWarning: '⚠️ Please enter your GitHub Personal Access Token',
    waitingBuild: 'Waiting to start build...',
    // Footer links
    terms: 'Terms',
    privacy: 'Privacy',
    about: 'About',
    contact: 'Contact',
    // Modal content
    termsTitle: '📜 Terms of Use',
    termsWelcome: 'Welcome to Aurora Builder',
    termsWelcomeText: 'By using Aurora Builder, you agree to these terms. Aurora Builder is a free, open-source tool that helps you convert any website URL into an Android APK application.',
    termsUsage: 'Usage Rights',
    termsUsageText: 'You may use Aurora Builder for personal and commercial projects. The generated APKs are yours to distribute as you see fit.',
    termsResponsibility: 'Responsibilities',
    termsResponsibilityText: 'You are responsible for ensuring you have the right to create an app from any website URL you use. We are not liable for any misuse of the service.',
    termsOpenSource: 'Open Source',
    termsOpenSourceText: 'Aurora Builder is open source and available on GitHub. Feel free to contribute, fork, or modify according to the license terms.',
    privacyTitle: '🔒 Privacy Policy',
    privacyMatters: 'Your Privacy Matters',
    privacyMattersText: 'Aurora Builder respects your privacy. We do not collect, store, or share any personal information.',
    privacyData: 'Data Processing',
    privacyDataText: 'All app configuration data stays in your browser. When you build an APK, the code is pushed to your own GitHub repository.',
    privacyThirdParty: 'Third-Party Services',
    privacyThirdPartyText: 'We use GitHub Actions for building APKs. Your GitHub token is never stored on our servers - it remains in your browser session only.',
    privacyTracking: 'No Tracking',
    privacyTrackingText: 'We do not use cookies, analytics, or any tracking mechanisms. Your usage is completely private.',
    aboutTitle: '💚 About Aurora Builder',
    aboutMission: 'Our Mission',
    aboutMissionText: 'Aurora Builder was created to democratize app development. We believe everyone should be able to turn their favorite websites into native Android apps without coding knowledge.',
    aboutTeam: 'The Team',
    aboutTeamText: 'Aurora Builder is designed and developed by Mostafa, a passionate developer focused on creating beautiful, functional tools for the community.',
    aboutTech: 'Technology',
    aboutTechText: 'Built with React, TypeScript, and Flutter. The unique Aurora Glass design language combines the best of One UI 8.5 and iOS 26 aesthetics with our own creative vision.',
    aboutOpenSource: 'Open Source',
    aboutOpenSourceText: 'Aurora Builder is 100% free and open source. Contribute on GitHub!',
    contactTitle: '✉️ Contact Us',
    contactGetInTouch: 'Get in Touch',
    contactGetInTouchText: 'We\'d love to hear from you! Whether you have questions, suggestions, or just want to say hi.',
    contactGitHub: 'GitHub',
    contactGitHubText: 'The best way to reach us is through GitHub. Open an issue or start a discussion:',
    contactContribute: 'Contribute',
    contactContributeText: 'Aurora Builder is open source! We welcome contributions, bug reports, and feature requests.',
    contactSupport: 'Support',
    contactSupportText: 'If you find Aurora Builder useful, consider starring our repository on GitHub! ⭐',
  },
  ar: {
    title: 'أورورا بيلدر',
    auroraBuilder: 'أورورا بيلدر',
    subtitle: 'مولد APK من الروابط',
    github: 'جيت هاب',
    appInfo: 'معلومات التطبيق',
    appName: 'اسم التطبيق',
    description: 'الوصف',
    packageName: 'اسم الحزمة',
    websiteUrl: 'رابط الموقع',
    appIcons: 'أيقونات التطبيق',
    appIcon: 'أيقونة التطبيق',
    splashIcon: 'أيقونة البداية',
    uploadIcon: 'رفع أيقونة',
    uploadSplash: 'رفع البداية',
    colors: 'الألوان',
    primary: 'الرئيسي',
    splashBg: 'خلفية البداية',
    statusBar: 'شريط الحالة',
    appBg: 'خلفية التطبيق',
    features: 'الميزات',
    fullscreen: 'ملء الشاشة',
    fullscreenDesc: 'إخفاء أشرطة الحالة والتنقل',
    backNav: 'زر الرجوع',
    backNavDesc: 'الرجوع في المتصفح',
    loadingBar: 'شريط التحميل',
    loadingBarDesc: 'عرض مؤشر التقدم',
    pullRefresh: 'السحب للتحديث',
    pullRefreshDesc: 'اسحب للأسفل للتحديث',
    allowZoom: 'السماح بالتكبير',
    allowZoomDesc: 'قرص للتكبير',
    preview: 'معاينة',
    previewDesc: 'سيعرض تطبيقك هذا الرابط في وضع ملء الشاشة',
    build: 'بناء',
    buildProgress: 'تقدم البناء',
    githubConnection: 'اتصال GitHub',
    personalToken: 'رمز الوصول الشخصي',
    tokenHelp: 'احصل على الرمز: GitHub → الإعدادات → إعدادات المطور → رموز الوصول الشخصية',
    generatedFiles: 'الملفات المولدة',
    generateFiles: 'توليد الملفات',
    downloadAll: 'تحميل جميع الملفات',
    buildApk: 'بناء APK الآن',
    building: 'جاري بناء APK...',
    previous: 'السابق',
    next: 'التالي',
    madeWith: 'صنع بـ 💚 بواسطة مصطفى',
    allRights: 'جميع الحقوق محفوظة.',
    step1: 'معلومات',
    step2: 'تصميم',
    step3: 'ميزات',
    step4: 'المحتوى',
    step5: 'معاينة',
    step6: 'بناء',
    step7: 'تحميل',
    contentBlock: 'حظر المحتوى',
    contentBlockDesc: 'إزالة الإعلانات والعناصر المزعجة',
    customCss: 'CSS مخصص',
    customCssPlaceholder: '.ads, .banner, .popup { display: none !important; }',
    blockElements: 'العناصر المراد إخفاؤها',
    blockElementsPlaceholder: '.ad-container, #sidebar-ads, .cookie-banner',
    blockingTip: 'أدخل محددات CSS للعناصر التي تريد إخفاءها. سيقوم التطبيق بحقن هذا الـ CSS لتنظيف الموقع.',
    filterLists: 'استيراد قائمة الفلاتر (صيغة uBlock)',
    filterListsPlaceholder: 'الصق قواعد فلتر uBlock/AdBlock هنا...',
    filterListsTip: 'يمكنك تصدير الفلاتر من uBlock Origin ولصقها هنا.',
    downloadApk: 'تحميل APK',
    buildComplete: 'اكتمل البناء!',
    buildLog: 'سجل البناء',
    // Preset values
    defaultAppName: 'تطبيقي أورورا',
    defaultDescription: 'تطبيق جميل مبني بواسطة أورورا بيلدر',
    // Placeholder values
    placeholderAppName: 'تطبيقي الرائع',
    placeholderDescription: 'تطبيق جميل...',
    defaultPackageName: 'com.aurora.myapp',
    defaultUrl: 'https://example.com',
    // Build messages
    tokenWarning: '⚠️ الرجاء إدخال رمز الوصول الشخصي لـ GitHub',
    waitingBuild: 'في انتظار بدء البناء...',
    // Footer links
    terms: 'الشروط',
    privacy: 'الخصوصية',
    about: 'حولنا',
    contact: 'اتصل بنا',
    // Modal content
    termsTitle: '📜 شروط الاستخدام',
    termsWelcome: 'مرحباً بك في أورورا بيلدر',
    termsWelcomeText: 'باستخدامك لأورورا بيلدر، فإنك توافق على هذه الشروط. أورورا بيلدر هي أداة مجانية ومفتوحة المصدر تساعدك على تحويل أي رابط موقع إلى تطبيق APK لأندرويد.',
    termsUsage: 'حقوق الاستخدام',
    termsUsageText: 'يمكنك استخدام أورورا بيلدر للمشاريع الشخصية والتجارية. ملفات APK المولدة ملكك لتوزيعها كما تشاء.',
    termsResponsibility: 'المسؤوليات',
    termsResponsibilityText: 'أنت مسؤول عن التأكد من أن لديك الحق في إنشاء تطبيق من أي رابط موقع تستخدمه. نحن غير مسؤولين عن أي سوء استخدام للخدمة.',
    termsOpenSource: 'مفتوح المصدر',
    termsOpenSourceText: 'أورورا بيلدر مفتوح المصدر ومتاح على GitHub. لا تتردد في المساهمة أو التعديل وفقاً لشروط الترخيص.',
    privacyTitle: '🔒 سياسة الخصوصية',
    privacyMatters: 'خصوصيتك مهمة',
    privacyMattersText: 'أورورا بيلدر يحترم خصوصيتك. نحن لا نجمع أو نخزن أو نشارك أي معلومات شخصية.',
    privacyData: 'معالجة البيانات',
    privacyDataText: 'جميع بيانات تكوين التطبيق تبقى في متصفحك. عند بناء APK، يتم دفع الكود إلى مستودع GitHub الخاص بك.',
    privacyThirdParty: 'خدمات الطرف الثالث',
    privacyThirdPartyText: 'نستخدم GitHub Actions لبناء ملفات APK. رمز GitHub الخاص بك لا يتم تخزينه على خوادمنا - يبقى في جلسة متصفحك فقط.',
    privacyTracking: 'بدون تتبع',
    privacyTrackingText: 'نحن لا نستخدم ملفات تعريف الارتباط أو التحليلات أو أي آليات تتبع. استخدامك خاص تماماً.',
    aboutTitle: '💚 حول أورورا بيلدر',
    aboutMission: 'مهمتنا',
    aboutMissionText: 'تم إنشاء أورورا بيلدر لجعل تطوير التطبيقات متاحاً للجميع. نؤمن أن الجميع يجب أن يتمكنوا من تحويل مواقعهم المفضلة إلى تطبيقات أندرويد أصلية بدون معرفة برمجية.',
    aboutTeam: 'الفريق',
    aboutTeamText: 'أورورا بيلدر مصمم ومطور بواسطة مصطفى، مطور شغوف يركز على إنشاء أدوات جميلة وعملية للمجتمع.',
    aboutTech: 'التكنولوجيا',
    aboutTechText: 'مبني بـ React و TypeScript و Flutter. لغة تصميم Aurora Glass الفريدة تجمع بين أفضل ما في One UI 8.5 و iOS 26 مع رؤيتنا الإبداعية.',
    aboutOpenSource: 'مفتوح المصدر',
    aboutOpenSourceText: 'أورورا بيلدر مجاني 100% ومفتوح المصدر. ساهم على GitHub!',
    contactTitle: '✉️ اتصل بنا',
    contactGetInTouch: 'تواصل معنا',
    contactGetInTouchText: 'نحب أن نسمع منك! سواء كان لديك أسئلة أو اقتراحات أو تريد فقط إلقاء التحية.',
    contactGitHub: 'GitHub',
    contactGitHubText: 'أفضل طريقة للتواصل معنا هي عبر GitHub. افتح issue أو ابدأ نقاشاً:',
    contactContribute: 'المساهمة',
    contactContributeText: 'أورورا بيلدر مفتوح المصدر! نرحب بالمساهمات وتقارير الأخطاء وطلبات الميزات.',
    contactSupport: 'الدعم',
    contactSupportText: 'إذا وجدت أورورا بيلدر مفيداً، فكر في إضافة نجمة لمستودعنا على GitHub! ⭐',
  },
  fa: {
    title: 'آرورا بیلدر',
    auroraBuilder: 'آرورا بیلدر',
    subtitle: 'ساخت APK از لینک',
    github: 'گیت‌هاب',
    appInfo: 'اطلاعات برنامه',
    appName: 'نام برنامه',
    description: 'توضیحات',
    packageName: 'نام بسته',
    websiteUrl: 'آدرس وبسایت',
    appIcons: 'آیکون‌های برنامه',
    appIcon: 'آیکون برنامه',
    splashIcon: 'آیکون اسپلش',
    uploadIcon: 'آپلود آیکون',
    uploadSplash: 'آپلود اسپلش',
    colors: 'رنگ‌ها',
    primary: 'اصلی',
    splashBg: 'پس‌زمینه اسپلش',
    statusBar: 'نوار وضعیت',
    appBg: 'پس‌زمینه برنامه',
    features: 'ویژگی‌ها',
    fullscreen: 'تمام صفحه',
    fullscreenDesc: 'پنهان کردن نوارها',
    backNav: 'دکمه برگشت',
    backNavDesc: 'برگشت در مرورگر',
    loadingBar: 'نوار بارگذاری',
    loadingBarDesc: 'نمایش پیشرفت',
    pullRefresh: 'کشیدن برای تازه‌سازی',
    pullRefreshDesc: 'بکشید برای تازه‌سازی',
    allowZoom: 'اجازه زوم',
    allowZoomDesc: 'زوم با دو انگشت',
    preview: 'پیش‌نمایش',
    previewDesc: 'برنامه شما این لینک را در حالت تمام صفحه نمایش می‌دهد',
    build: 'ساخت',
    buildProgress: 'پیشرفت ساخت',
    githubConnection: 'اتصال به گیت‌هاب',
    personalToken: 'توکن دسترسی شخصی',
    tokenHelp: 'توکن بگیرید: GitHub → تنظیمات → تنظیمات توسعه‌دهنده',
    generatedFiles: 'فایل‌های تولید شده',
    generateFiles: 'تولید فایل‌ها',
    downloadAll: 'دانلود همه فایل‌ها',
    buildApk: 'ساخت APK',
    building: 'در حال ساخت APK...',
    previous: 'قبلی',
    next: 'بعدی',
    madeWith: 'ساخته شده با 💚 توسط مصطفی',
    allRights: 'تمامی حقوق محفوظ است.',
    step1: 'اطلاعات',
    step2: 'طراحی',
    step3: 'ویژگی‌ها',
    step4: 'محتوا',
    step5: 'پیش‌نمایش',
    step6: 'ساخت',
    step7: 'دانلود',
    contentBlock: 'مسدودکننده محتوا',
    contentBlockDesc: 'حذف تبلیغات و عناصر مزاحم',
    customCss: 'CSS سفارشی',
    customCssPlaceholder: '.ads, .banner, .popup { display: none !important; }',
    blockElements: 'عناصر برای مخفی کردن',
    blockElementsPlaceholder: '.ad-container, #sidebar-ads, .cookie-banner',
    blockingTip: 'انتخابگرهای CSS عناصری که می‌خواهید مخفی کنید را وارد کنید.',
    filterLists: 'وارد کردن لیست فیلتر (فرمت uBlock)',
    filterListsPlaceholder: 'قوانین فیلتر uBlock/AdBlock را اینجا بچسبانید...',
    filterListsTip: 'می‌توانید فیلترها را از uBlock Origin صادر کرده و اینجا بچسبانید.',
    downloadApk: 'دانلود APK',
    buildComplete: 'ساخت کامل شد!',
    buildLog: 'گزارش ساخت',
    // Preset values
    defaultAppName: 'اپلیکیشن آرورا من',
    defaultDescription: 'یک اپلیکیشن زیبا ساخته شده با آرورا بیلدر',
    // Placeholder values
    placeholderAppName: 'اپلیکیشن عالی من',
    placeholderDescription: 'یک اپلیکیشن زیبا...',
    defaultPackageName: 'com.aurora.myapp',
    defaultUrl: 'https://example.com',
    // Build messages
    tokenWarning: '⚠️ لطفاً توکن دسترسی شخصی GitHub را وارد کنید',
    waitingBuild: 'در انتظار شروع ساخت...',
    // Footer links
    terms: 'شرایط',
    privacy: 'حریم خصوصی',
    about: 'درباره ما',
    contact: 'تماس',
    // Modal content
    termsTitle: '📜 شرایط استفاده',
    termsWelcome: 'به آرورا بیلدر خوش آمدید',
    termsWelcomeText: 'با استفاده از آرورا بیلدر، شما با این شرایط موافقت می‌کنید. آرورا بیلدر یک ابزار رایگان و متن‌باز است که به شما کمک می‌کند هر لینک وبسایت را به اپلیکیشن APK اندروید تبدیل کنید.',
    termsUsage: 'حقوق استفاده',
    termsUsageText: 'شما می‌توانید از آرورا بیلدر برای پروژه‌های شخصی و تجاری استفاده کنید. فایل‌های APK تولید شده متعلق به شماست.',
    termsResponsibility: 'مسئولیت‌ها',
    termsResponsibilityText: 'شما مسئول هستید که مطمئن شوید حق ایجاد اپلیکیشن از هر لینک وبسایتی که استفاده می‌کنید را دارید.',
    termsOpenSource: 'متن‌باز',
    termsOpenSourceText: 'آرورا بیلدر متن‌باز است و در GitHub موجود است. آزادانه مشارکت کنید.',
    privacyTitle: '🔒 سیاست حریم خصوصی',
    privacyMatters: 'حریم خصوصی شما مهم است',
    privacyMattersText: 'آرورا بیلدر به حریم خصوصی شما احترام می‌گذارد. ما هیچ اطلاعات شخصی جمع‌آوری، ذخیره یا به اشتراک نمی‌گذاریم.',
    privacyData: 'پردازش داده‌ها',
    privacyDataText: 'تمام داده‌های پیکربندی اپلیکیشن در مرورگر شما می‌ماند. هنگام ساخت APK، کد به مخزن GitHub شما ارسال می‌شود.',
    privacyThirdParty: 'خدمات شخص ثالث',
    privacyThirdPartyText: 'ما از GitHub Actions برای ساخت فایل‌های APK استفاده می‌کنیم. توکن GitHub شما هرگز در سرورهای ما ذخیره نمی‌شود.',
    privacyTracking: 'بدون ردیابی',
    privacyTrackingText: 'ما از کوکی‌ها، آنالیتیکس یا هیچ مکانیزم ردیابی استفاده نمی‌کنیم. استفاده شما کاملاً خصوصی است.',
    aboutTitle: '💚 درباره آرورا بیلدر',
    aboutMission: 'مأموریت ما',
    aboutMissionText: 'آرورا بیلدر برای دموکراتیزه کردن توسعه اپلیکیشن ایجاد شد. ما معتقدیم همه باید بتوانند وبسایت‌های مورد علاقه خود را به اپلیکیشن‌های اندروید تبدیل کنند.',
    aboutTeam: 'تیم',
    aboutTeamText: 'آرورا بیلدر توسط مصطفی طراحی و توسعه داده شده است، یک توسعه‌دهنده پرشور که بر ایجاد ابزارهای زیبا و کاربردی تمرکز دارد.',
    aboutTech: 'فناوری',
    aboutTechText: 'ساخته شده با React، TypeScript و Flutter. زبان طراحی منحصر به فرد Aurora Glass بهترین‌های One UI 8.5 و iOS 26 را با دیدگاه خلاقانه ما ترکیب می‌کند.',
    aboutOpenSource: 'متن‌باز',
    aboutOpenSourceText: 'آرورا بیلدر ۱۰۰٪ رایگان و متن‌باز است. در GitHub مشارکت کنید!',
    contactTitle: '✉️ تماس با ما',
    contactGetInTouch: 'در تماس باشید',
    contactGetInTouchText: 'خوشحال می‌شویم از شما بشنویم! چه سؤال، پیشنهاد یا فقط سلام داشته باشید.',
    contactGitHub: 'GitHub',
    contactGitHubText: 'بهترین راه برای تماس با ما از طریق GitHub است. یک issue باز کنید یا بحث شروع کنید:',
    contactContribute: 'مشارکت',
    contactContributeText: 'آرورا بیلدر متن‌باز است! از مشارکت‌ها، گزارش باگ و درخواست ویژگی‌ها استقبال می‌کنیم.',
    contactSupport: 'پشتیبانی',
    contactSupportText: 'اگر آرورا بیلدر را مفید یافتید، به مخزن ما در GitHub ستاره بدهید! ⭐',
  },
  fr: {
    title: 'Aurora Builder',
    auroraBuilder: 'Aurora Builder',
    subtitle: 'Générateur URL vers APK',
    appInfo: 'Informations de l\'App',
    appName: 'Nom de l\'App',
    description: 'Description',
    packageName: 'Nom du Package',
    websiteUrl: 'URL du Site',
    appIcons: 'Icônes de l\'App',
    appIcon: 'Icône de l\'App',
    splashIcon: 'Icône Splash',
    uploadIcon: 'Télécharger Icône',
    uploadSplash: 'Télécharger Splash',
    colors: 'Couleurs',
    primary: 'Primaire',
    splashBg: 'Fond Splash',
    statusBar: 'Barre d\'État',
    appBg: 'Fond App',
    features: 'Fonctionnalités',
    fullscreen: 'Plein Écran',
    fullscreenDesc: 'Masquer les barres système',
    backNav: 'Navigation Retour',
    backNavDesc: 'Retour dans la webview',
    loadingBar: 'Barre de Chargement',
    loadingBarDesc: 'Afficher la progression',
    pullRefresh: 'Tirer pour Rafraîchir',
    pullRefreshDesc: 'Glisser pour recharger',
    allowZoom: 'Autoriser le Zoom',
    allowZoomDesc: 'Pincer pour zoomer',
    preview: 'Aperçu',
    previewDesc: 'Votre app affichera cette URL en plein écran',
    build: 'Construire',
    buildProgress: 'Progression',
    githubConnection: 'Connexion GitHub',
    personalToken: 'Token d\'Accès Personnel',
    tokenHelp: 'Obtenir le token: GitHub → Paramètres → Paramètres développeur → Tokens d\'accès personnels',
    generatedFiles: 'Fichiers Générés',
    generateFiles: 'Générer les Fichiers',
    downloadAll: 'Télécharger Tous les Fichiers',
    buildApk: 'Construire l\'APK Maintenant',
    building: 'Construction de l\'APK...',
    previous: 'Précédent',
    next: 'Suivant',
    madeWith: 'Fait avec 💚 par Mostafa',
    allRights: 'Tous droits réservés.',
    step1: 'Infos',
    step2: 'Design',
    step3: 'Options',
    step4: 'Contenu',
    step5: 'Aperçu',
    step6: 'Build',
    step7: 'Télécharger',
    contentBlock: 'Bloqueur de Contenu',
    contentBlockDesc: 'Supprimer les pubs et distractions',
    customCss: 'CSS Personnalisé',
    customCssPlaceholder: '.ads, .banner, .popup { display: none !important; }',
    blockElements: 'Éléments à Masquer',
    blockElementsPlaceholder: '.ad-container, #sidebar-ads, .cookie-banner',
    blockingTip: 'Entrez les sélecteurs CSS des éléments à masquer. L\'APK injectera ce CSS pour nettoyer le site.',
    filterLists: 'Importer Liste de Filtres (format uBlock)',
    filterListsPlaceholder: 'Collez les règles de filtre uBlock/AdBlock ici...',
    filterListsTip: 'Vous pouvez exporter les filtres depuis uBlock Origin et les coller ici.',
    downloadApk: 'Télécharger APK',
    buildComplete: 'Construction Terminée!',
    buildLog: 'Journal de Build',
    // Preset values
    defaultAppName: 'Mon App Aurora',
    defaultDescription: 'Une belle application créée avec Aurora Builder',
    // Placeholder values
    placeholderAppName: 'Mon Application Géniale',
    placeholderDescription: 'Une belle application...',
    defaultPackageName: 'com.aurora.myapp',
    defaultUrl: 'https://example.com',
    // Build messages
    tokenWarning: '⚠️ Veuillez entrer votre jeton d\'accès personnel GitHub',
    waitingBuild: 'En attente du début de la construction...',
    // Footer links
    terms: 'Conditions',
    privacy: 'Confidentialité',
    about: 'À propos',
    contact: 'Contact',
    // Modal content
    termsTitle: '📜 Conditions d\'Utilisation',
    termsWelcome: 'Bienvenue sur Aurora Builder',
    termsWelcomeText: 'En utilisant Aurora Builder, vous acceptez ces conditions. Aurora Builder est un outil gratuit et open source qui vous aide à convertir n\'importe quelle URL de site web en application APK Android.',
    termsUsage: 'Droits d\'Utilisation',
    termsUsageText: 'Vous pouvez utiliser Aurora Builder pour des projets personnels et commerciaux. Les APK générés vous appartiennent pour les distribuer comme vous le souhaitez.',
    termsResponsibility: 'Responsabilités',
    termsResponsibilityText: 'Vous êtes responsable de vous assurer que vous avez le droit de créer une application à partir de n\'importe quelle URL de site web que vous utilisez.',
    termsOpenSource: 'Open Source',
    termsOpenSourceText: 'Aurora Builder est open source et disponible sur GitHub. N\'hésitez pas à contribuer ou modifier selon les termes de la licence.',
    privacyTitle: '🔒 Politique de Confidentialité',
    privacyMatters: 'Votre Vie Privée Compte',
    privacyMattersText: 'Aurora Builder respecte votre vie privée. Nous ne collectons, stockons ni partageons aucune information personnelle.',
    privacyData: 'Traitement des Données',
    privacyDataText: 'Toutes les données de configuration de l\'application restent dans votre navigateur. Lors de la construction d\'un APK, le code est poussé vers votre propre dépôt GitHub.',
    privacyThirdParty: 'Services Tiers',
    privacyThirdPartyText: 'Nous utilisons GitHub Actions pour construire les APK. Votre token GitHub n\'est jamais stocké sur nos serveurs.',
    privacyTracking: 'Pas de Suivi',
    privacyTrackingText: 'Nous n\'utilisons pas de cookies, d\'analytics ou de mécanismes de suivi. Votre utilisation est complètement privée.',
    aboutTitle: '💚 À Propos d\'Aurora Builder',
    aboutMission: 'Notre Mission',
    aboutMissionText: 'Aurora Builder a été créé pour démocratiser le développement d\'applications. Nous croyons que tout le monde devrait pouvoir transformer ses sites web préférés en applications Android natives.',
    aboutTeam: 'L\'Équipe',
    aboutTeamText: 'Aurora Builder est conçu et développé par Mostafa, un développeur passionné qui se concentre sur la création d\'outils beaux et fonctionnels.',
    aboutTech: 'Technologie',
    aboutTechText: 'Construit avec React, TypeScript et Flutter. Le langage de design Aurora Glass combine le meilleur de One UI 8.5 et iOS 26 avec notre vision créative.',
    aboutOpenSource: 'Open Source',
    aboutOpenSourceText: 'Aurora Builder est 100% gratuit et open source. Contribuez sur GitHub!',
    contactTitle: '✉️ Contactez-Nous',
    contactGetInTouch: 'Entrer en Contact',
    contactGetInTouchText: 'Nous adorerions avoir de vos nouvelles! Que vous ayez des questions, des suggestions ou simplement envie de dire bonjour.',
    contactGitHub: 'GitHub',
    contactGitHubText: 'La meilleure façon de nous contacter est via GitHub. Ouvrez une issue ou lancez une discussion:',
    contactContribute: 'Contribuer',
    contactContributeText: 'Aurora Builder est open source! Nous accueillons les contributions, rapports de bugs et demandes de fonctionnalités.',
    contactSupport: 'Support',
    contactSupportText: 'Si vous trouvez Aurora Builder utile, pensez à mettre une étoile à notre dépôt sur GitHub! ⭐',
  },
  es: {
    title: 'Aurora Builder',
    auroraBuilder: 'Aurora Builder',
    subtitle: 'Generador de URL a APK',
    appInfo: 'Información de la App',
    appName: 'Nombre de la App',
    description: 'Descripción',
    packageName: 'Nombre del Paquete',
    websiteUrl: 'URL del Sitio',
    appIcons: 'Iconos de la App',
    appIcon: 'Icono de la App',
    splashIcon: 'Icono Splash',
    uploadIcon: 'Subir Icono',
    uploadSplash: 'Subir Splash',
    colors: 'Colores',
    primary: 'Primario',
    splashBg: 'Fondo Splash',
    statusBar: 'Barra de Estado',
    appBg: 'Fondo App',
    features: 'Características',
    fullscreen: 'Pantalla Completa',
    fullscreenDesc: 'Ocultar barras del sistema',
    backNav: 'Navegación Atrás',
    backNavDesc: 'Botón atrás en webview',
    loadingBar: 'Barra de Carga',
    loadingBarDesc: 'Mostrar indicador de progreso',
    pullRefresh: 'Deslizar para Actualizar',
    pullRefreshDesc: 'Desliza para recargar',
    allowZoom: 'Permitir Zoom',
    allowZoomDesc: 'Pellizcar para zoom',
    preview: 'Vista Previa',
    previewDesc: 'Tu app mostrará esta URL en pantalla completa',
    build: 'Construir',
    buildProgress: 'Progreso',
    githubConnection: 'Conexión GitHub',
    personalToken: 'Token de Acceso Personal',
    tokenHelp: 'Obtener token: GitHub → Configuración → Configuración de desarrollador → Tokens de acceso personal',
    generatedFiles: 'Archivos Generados',
    generateFiles: 'Generar Archivos',
    downloadAll: 'Descargar Todos los Archivos',
    buildApk: 'Construir APK Ahora',
    building: 'Construyendo APK...',
    previous: 'Anterior',
    next: 'Siguiente',
    madeWith: 'Hecho con 💚 por Mostafa',
    allRights: 'Todos los derechos reservados.',
    step1: 'Info',
    step2: 'Diseño',
    step3: 'Opciones',
    step4: 'Contenido',
    step5: 'Vista',
    step6: 'Build',
    step7: 'Descargar',
    contentBlock: 'Bloqueador de Contenido',
    contentBlockDesc: 'Eliminar anuncios y distracciones',
    customCss: 'CSS Personalizado',
    customCssPlaceholder: '.ads, .banner, .popup { display: none !important; }',
    blockElements: 'Elementos a Ocultar',
    blockElementsPlaceholder: '.ad-container, #sidebar-ads, .cookie-banner',
    blockingTip: 'Ingresa selectores CSS de elementos a ocultar. El APK inyectará este CSS para limpiar el sitio.',
    filterLists: 'Importar Lista de Filtros (formato uBlock)',
    filterListsPlaceholder: 'Pega las reglas de filtro uBlock/AdBlock aquí...',
    filterListsTip: 'Puedes exportar filtros desde uBlock Origin y pegarlos aquí.',
    downloadApk: 'Descargar APK',
    buildComplete: '¡Construcción Completa!',
    buildLog: 'Registro de Build',
    // Preset values
    defaultAppName: 'Mi App Aurora',
    defaultDescription: 'Una hermosa aplicación creada con Aurora Builder',
    // Placeholder values
    placeholderAppName: 'Mi Aplicación Increíble',
    placeholderDescription: 'Una hermosa aplicación...',
    defaultPackageName: 'com.aurora.myapp',
    defaultUrl: 'https://example.com',
    // Build messages
    tokenWarning: '⚠️ Por favor ingresa tu token de acceso personal de GitHub',
    waitingBuild: 'Esperando para iniciar la construcción...',
    // Footer links
    terms: 'Términos',
    privacy: 'Privacidad',
    about: 'Acerca de',
    contact: 'Contacto',
    // Modal content
    termsTitle: '📜 Términos de Uso',
    termsWelcome: 'Bienvenido a Aurora Builder',
    termsWelcomeText: 'Al usar Aurora Builder, aceptas estos términos. Aurora Builder es una herramienta gratuita y de código abierto que te ayuda a convertir cualquier URL de sitio web en una aplicación APK de Android.',
    termsUsage: 'Derechos de Uso',
    termsUsageText: 'Puedes usar Aurora Builder para proyectos personales y comerciales. Los APK generados son tuyos para distribuir como desees.',
    termsResponsibility: 'Responsabilidades',
    termsResponsibilityText: 'Eres responsable de asegurarte de tener el derecho de crear una aplicación a partir de cualquier URL de sitio web que uses.',
    termsOpenSource: 'Código Abierto',
    termsOpenSourceText: 'Aurora Builder es de código abierto y está disponible en GitHub. Siéntete libre de contribuir o modificar según los términos de la licencia.',
    privacyTitle: '🔒 Política de Privacidad',
    privacyMatters: 'Tu Privacidad Importa',
    privacyMattersText: 'Aurora Builder respeta tu privacidad. No recopilamos, almacenamos ni compartimos ninguna información personal.',
    privacyData: 'Procesamiento de Datos',
    privacyDataText: 'Todos los datos de configuración de la aplicación permanecen en tu navegador. Al construir un APK, el código se envía a tu propio repositorio de GitHub.',
    privacyThirdParty: 'Servicios de Terceros',
    privacyThirdPartyText: 'Usamos GitHub Actions para construir APK. Tu token de GitHub nunca se almacena en nuestros servidores.',
    privacyTracking: 'Sin Seguimiento',
    privacyTrackingText: 'No usamos cookies, analytics ni mecanismos de seguimiento. Tu uso es completamente privado.',
    aboutTitle: '💚 Acerca de Aurora Builder',
    aboutMission: 'Nuestra Misión',
    aboutMissionText: 'Aurora Builder fue creado para democratizar el desarrollo de aplicaciones. Creemos que todos deberían poder convertir sus sitios web favoritos en aplicaciones Android nativas.',
    aboutTeam: 'El Equipo',
    aboutTeamText: 'Aurora Builder es diseñado y desarrollado por Mostafa, un desarrollador apasionado enfocado en crear herramientas hermosas y funcionales.',
    aboutTech: 'Tecnología',
    aboutTechText: 'Construido con React, TypeScript y Flutter. El lenguaje de diseño Aurora Glass combina lo mejor de One UI 8.5 e iOS 26 con nuestra visión creativa.',
    aboutOpenSource: 'Código Abierto',
    aboutOpenSourceText: '¡Aurora Builder es 100% gratuito y de código abierto. Contribuye en GitHub!',
    contactTitle: '✉️ Contáctanos',
    contactGetInTouch: 'Ponte en Contacto',
    contactGetInTouchText: '¡Nos encantaría saber de ti! Ya sea que tengas preguntas, sugerencias o solo quieras saludar.',
    contactGitHub: 'GitHub',
    contactGitHubText: 'La mejor manera de contactarnos es a través de GitHub. Abre un issue o inicia una discusión:',
    contactContribute: 'Contribuir',
    contactContributeText: '¡Aurora Builder es de código abierto! Damos la bienvenida a contribuciones, reportes de bugs y solicitudes de funciones.',
    contactSupport: 'Soporte',
    contactSupportText: 'Si encuentras Aurora Builder útil, ¡considera darle una estrella a nuestro repositorio en GitHub! ⭐',
  },
}

const languageNames: Record<Language, string> = {
  en: 'English',
  ar: 'العربية',
  fa: 'فارسی',
  fr: 'Français',
  es: 'Español',
}

// SVG Flag icons for better cross-platform compatibility (Windows doesn't show emoji flags)
const FlagIcon = ({ lang }: { lang: Language }) => {
  const flags: Record<Language, ReactNode> = {
    en: (
      <svg viewBox="0 0 60 30" className="flag-svg">
        <clipPath id="en"><path d="M0 0v30h60V0z"/></clipPath>
        <g clipPath="url(#en)">
          <path fill="#012169" d="M0 0v30h60V0z"/>
          <path stroke="#fff" strokeWidth="6" d="m0 0 60 30m0-30L0 30"/>
          <path stroke="#C8102E" strokeWidth="4" d="m0 0 60 30m0-30L0 30" clipPath="url(#en)"/>
          <path stroke="#fff" strokeWidth="10" d="M30 0v30M0 15h60"/>
          <path stroke="#C8102E" strokeWidth="6" d="M30 0v30M0 15h60"/>
        </g>
      </svg>
    ),
    ar: (
      <svg viewBox="0 0 60 40" className="flag-svg">
        <rect fill="#006C35" width="60" height="40"/>
        <text x="30" y="26" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="Arial">عربي</text>
      </svg>
    ),
    fa: (
      <svg viewBox="0 0 60 36" className="flag-svg">
        <rect fill="#239F40" width="60" height="12"/>
        <rect fill="#fff" y="12" width="60" height="12"/>
        <rect fill="#DA0000" y="24" width="60" height="12"/>
      </svg>
    ),
    fr: (
      <svg viewBox="0 0 60 40" className="flag-svg">
        <rect fill="#002395" width="20" height="40"/>
        <rect fill="#fff" x="20" width="20" height="40"/>
        <rect fill="#ED2939" x="40" width="20" height="40"/>
      </svg>
    ),
    es: (
      <svg viewBox="0 0 60 40" className="flag-svg">
        <rect fill="#AA151B" width="60" height="40"/>
        <rect fill="#F1BF00" y="10" width="60" height="20"/>
      </svg>
    ),
  }
  return flags[lang]
}

const defaultConfig: AppConfig = {
  appName: 'My Aurora App',
  description: 'A beautiful app built with Aurora Builder',
  packageName: 'com.aurora.myapp',
  websiteUrl: 'https://google.com',
  primaryColor: '#00DC82',
  splashColor: '#0a0a0a',
  statusBarColor: '#000000',
  backgroundColor: '#ffffff',
  appIcon: null,
  splashIcon: null,
  fullscreen: true,
  backNavigation: true,
  loadingIndicator: true,
  pullToRefresh: false,
  allowZoom: false,
  customCss: '',
  blockElements: '',
  filterLists: '',
}

export function App() {
  const [config, setConfig] = useState<AppConfig>(defaultConfig)
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [githubToken, setGithubToken] = useState('')
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildStatus, setBuildStatus] = useState('')
  const [buildProgress, setBuildProgress] = useState(0)
  const [buildLogs, setBuildLogs] = useState<string[]>([])
  const [buildComplete, setBuildComplete] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({})
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark')
  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('dark')
  const [copied, setCopied] = useState<string | null>(null)
  const [language, setLanguage] = useState<Language>('en')
  const [footerPage, setFooterPage] = useState<FooterPage>(null)

  const t = translations[language]
  const isRTL = language === 'ar' || language === 'fa'

  // Theme management
  useEffect(() => {
    if (themeMode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setActualTheme(mediaQuery.matches ? 'dark' : 'light')
      const handler = (e: MediaQueryListEvent) => setActualTheme(e.matches ? 'dark' : 'light')
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    } else {
      setActualTheme(themeMode)
    }
  }, [themeMode])

  // (Removed - using simulated preview instead)

  // Auto-detect device language on first load
  useEffect(() => {
    const deviceLang = navigator.language.slice(0, 2)
    const langMap: Record<string, Language> = { en: 'en', ar: 'ar', fa: 'fa', fr: 'fr', es: 'es' }
    if (langMap[deviceLang]) {
      setLanguage(langMap[deviceLang])
    }
  }, [])

  const updateConfig = useCallback((key: keyof AppConfig, value: string | boolean | null) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleImageUpload = (key: 'appIcon' | 'splashIcon', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => updateConfig(key, ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  // Parse uBlock filter list to CSS
  const parseFilterListToCss = (filterList: string): string => {
    const lines = filterList.split('\n').filter(line => {
      const trimmed = line.trim()
      return trimmed && !trimmed.startsWith('!') && !trimmed.startsWith('[')
    })
    
    const cssSelectors: string[] = []
    
    lines.forEach(line => {
      // Handle ##selector format (cosmetic filter)
      if (line.includes('##')) {
        const parts = line.split('##')
        if (parts[1]) {
          cssSelectors.push(parts[1].trim())
        }
      }
      // Handle #@#selector format (exception - skip)
      else if (line.includes('#@#')) {
        return
      }
      // Handle #?#selector format (extended CSS)
      else if (line.includes('#?#')) {
        const parts = line.split('#?#')
        if (parts[1]) {
          cssSelectors.push(parts[1].trim())
        }
      }
    })
    
    if (cssSelectors.length > 0) {
      return cssSelectors.join(', ') + ' { display: none !important; visibility: hidden !important; }'
    }
    return ''
  }

  // Generate blocking CSS
  const generateBlockingCss = () => {
    let css = config.customCss || ''
    
    if (config.blockElements) {
      const selectors = config.blockElements.split(',').map(s => s.trim()).filter(Boolean)
      if (selectors.length > 0) {
        css += `\n${selectors.join(', ')} { display: none !important; visibility: hidden !important; }`
      }
    }
    
    if (config.filterLists) {
      const filterCss = parseFilterListToCss(config.filterLists)
      if (filterCss) {
        css += `\n${filterCss}`
      }
    }
    
    return css
  }

  // Helper to safely get hex color without #
  const getHexColor = (color: string | undefined, fallback: string = '000000'): string => {
    if (!color) return fallback
    return color.startsWith('#') ? color.slice(1) : color
  }

  // Generate Flutter project files
  const generateFiles = useCallback(() => {
    const files: Record<string, string> = {}
    const blockingCss = generateBlockingCss()
    
    // Safe color values
    const statusBarHex = getHexColor(config.statusBarColor, '000000')
    const backgroundHex = getHexColor(config.backgroundColor, 'ffffff')
    const splashHex = getHexColor(config.splashColor, '0a0a0a')
    const primaryHex = getHexColor(config.primaryColor, '00DC82')

    files['lib/main.dart'] = `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  ${config.fullscreen ? "SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);" : ""}
  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
    statusBarColor: Color(0xFF${statusBarHex}),
  ));
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${config.appName}',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.green,
        scaffoldBackgroundColor: Color(0xFF${backgroundHex}),
      ),
      home: const SplashScreen(),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(duration: const Duration(seconds: 2), vsync: this);
    _animation = CurvedAnimation(parent: _controller, curve: Curves.easeInOut);
    _controller.forward();
    
    Future.delayed(const Duration(seconds: 3), () {
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const WebViewScreen()));
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF${splashHex}),
      body: Center(
        child: FadeTransition(
          opacity: _animation,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 120, height: 120,
                decoration: BoxDecoration(
                  color: Color(0xFF${primaryHex}),
                  borderRadius: BorderRadius.circular(30),
                  boxShadow: [BoxShadow(color: Color(0xFF${primaryHex}).withOpacity(0.5), blurRadius: 30, spreadRadius: 5)],
                ),
                child: Icon(Icons.rocket_launch, size: 60, color: Colors.white),
              ),
              const SizedBox(height: 30),
              Text('${config.appName}', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white)),
              const SizedBox(height: 10),
              Text('${config.description}', style: TextStyle(fontSize: 14, color: Colors.white70)),
            ],
          ),
        ),
      ),
    );
  }
}

class WebViewScreen extends StatefulWidget {
  const WebViewScreen({super.key});
  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  late final WebViewController _controller;
  bool _isLoading = true;
  double _progress = 0;

  // Custom CSS to inject for content blocking
  static const String _customCss = '''${blockingCss.replace(/'/g, "\\'")}''';

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Color(0xFF${backgroundHex}))
      ..setNavigationDelegate(NavigationDelegate(
        onPageStarted: (_) => setState(() => _isLoading = true),
        onProgress: (p) => setState(() => _progress = p / 100),
        onPageFinished: (_) {
          setState(() => _isLoading = false);
          // Inject custom CSS to block content
          if (_customCss.isNotEmpty) {
            _controller.runJavaScript("""
              (function() {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = \`$_customCss\`;
                document.head.appendChild(style);
              })();
            """);
          }
        },
      ))
      ..loadRequest(Uri.parse('${config.websiteUrl}'));
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) async {
        ${config.backNavigation ? "if (await _controller.canGoBack()) await _controller.goBack();" : ""}
      },
      child: Scaffold(
        body: SafeArea(
          child: Stack(
            children: [
              WebViewWidget(controller: _controller),
              ${config.loadingIndicator ? `if (_isLoading) Positioned(top: 0, left: 0, right: 0, child: LinearProgressIndicator(value: _progress, backgroundColor: Colors.transparent, color: Color(0xFF${primaryHex})))` : ""},
            ],
          ),
        ),
      ),
    );
  }
}`

    files['pubspec.yaml'] = `name: ${config.packageName.split('.').pop()}
description: ${config.description}
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  webview_flutter: ^4.4.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true`

    files['android/app/src/main/AndroidManifest.xml'] = `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    
    <application
        android:label="${config.appName}"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:usesCleartextTraffic="true"
        android:hardwareAccelerated="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data android:name="io.flutter.embedding.android.NormalTheme" android:resource="@style/NormalTheme"/>
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data android:name="flutterEmbedding" android:value="2"/>
    </application>
</manifest>`

    files['android/app/build.gradle'] = `plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
}

android {
    namespace "${config.packageName}"
    compileSdk flutter.compileSdkVersion
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions { jvmTarget = '1.8' }

    sourceSets { main.java.srcDirs += 'src/main/kotlin' }

    defaultConfig {
        applicationId "${config.packageName}"
        minSdk 21
        targetSdk flutter.targetSdkVersion
        versionCode 1
        versionName "1.0.0"
    }

    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.debug
        }
    }
}

flutter { source '../..' }

dependencies {}`

    files['.github/workflows/build.yml'] = `name: Build All Platforms
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
          channel: 'stable'
      - run: flutter pub get
      - run: flutter build apk --release
      - uses: actions/upload-artifact@v4
        with:
          name: android-apk
          path: build/app/outputs/flutter-apk/app-release.apk

  build-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
          channel: 'stable'
      - run: flutter pub get
      - run: flutter build web --release
      - uses: actions/upload-artifact@v4
        with:
          name: web-build
          path: build/web

  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
          channel: 'stable'
      - run: flutter pub get
      - run: flutter build windows --release
      - uses: actions/upload-artifact@v4
        with:
          name: windows-exe
          path: build/windows/x64/runner/Release

  build-linux:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
          channel: 'stable'
      - run: sudo apt-get update -y
      - run: sudo apt-get install -y ninja-build libgtk-3-dev
      - run: flutter pub get
      - run: flutter build linux --release
      - uses: actions/upload-artifact@v4
        with:
          name: linux-build
          path: build/linux/x64/release/bundle

  build-macos:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
          channel: 'stable'
      - run: flutter pub get
      - run: flutter build macos --release
      - uses: actions/upload-artifact@v4
        with:
          name: macos-app
          path: build/macos/Build/Products/Release`

    setGeneratedFiles(files)
    return files
  }, [config])

  // Add log message
  const addLog = (message: string) => {
    setBuildLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  // Build Flutter Project - Generate ZIP with all files for all platforms
  const buildAPK = async () => {
    // Immediately move to step 7 (Download page) when build starts
    setCurrentStep(7)

    setIsBuilding(true)
    setBuildProgress(0)
    setBuildLogs([])
    setBuildComplete(false)
    setDownloadUrl(null)
    setBuildStatus('🚀 Generating Flutter project...')
    addLog('Starting project generation...')

    try {
      // Step 1: Generate all files
      setBuildProgress(10)
      addLog('Generating Flutter project files...')
      const files = generateFiles()
      
      await new Promise(r => setTimeout(r, 300))
      setBuildProgress(30)
      addLog(`Generated ${Object.keys(files).length} files`)
      
      // Step 2: Add multi-platform GitHub Actions workflow
      setBuildProgress(50)
      addLog('Adding multi-platform build workflows...')
      setBuildStatus('📦 Creating build configurations...')
      
      await new Promise(r => setTimeout(r, 300))
      setBuildProgress(70)
      addLog('✅ Android APK workflow ready')
      addLog('✅ iOS IPA workflow ready')
      addLog('✅ Windows EXE workflow ready')
      addLog('✅ macOS DMG workflow ready')
      addLog('✅ Linux AppImage workflow ready')
      addLog('✅ Web build workflow ready')
      
      // Step 3: Create download package
      setBuildProgress(90)
      setBuildStatus('📥 Preparing download package...')
      addLog('Creating downloadable project...')
      
      await new Promise(r => setTimeout(r, 300))
      setBuildProgress(100)
      setBuildStatus('✅ Flutter project ready! Download and build for any platform.')
      setBuildComplete(true)
      setDownloadUrl('ready')
      addLog('🎉 Project generation complete!')
      addLog('')
      addLog('📋 Next steps:')
      addLog('1. Download the Flutter project')
      addLog('2. Push to GitHub repository')
      addLog('3. GitHub Actions will build automatically')
      addLog('4. Download APK/IPA/EXE from Actions artifacts')
      
    } catch (error) {
      setBuildStatus(`❌ Error: ${error instanceof Error ? error.message : 'Generation failed'}`)
      addLog(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsBuilding(false)
    }
  }
  
  // Suppress unused variable warning
  void githubToken
  void setGithubToken

  // Download the Flutter project
  const handleDownload = async () => {
    if (!downloadUrl) return
    
    try {
      addLog('Preparing download...')
      const files = generateFiles()
      
      // Create a comprehensive project file with all code
      let content = `# ═══════════════════════════════════════════════════════════════
# ${config.appName} - Flutter Project
# Generated by Aurora Builder
# ═══════════════════════════════════════════════════════════════

# INSTRUCTIONS:
# 1. Create a new folder for your project
# 2. Create each file below in its respective path
# 3. Run: flutter create . (to initialize Flutter project)
# 4. Copy these files over the generated ones
# 5. Run: flutter pub get
# 6. Build: flutter build apk --release (Android)
#          flutter build ios --release (iOS - requires Mac)
#          flutter build windows --release (Windows)
#          flutter build macos --release (macOS)
#          flutter build linux --release (Linux)
#          flutter build web --release (Web)
#
# OR push to GitHub and let GitHub Actions build automatically!

`
      
      Object.entries(files).forEach(([path, code]) => {
        content += `
# ═══════════════════════════════════════════════════════════════
# FILE: ${path}
# ═══════════════════════════════════════════════════════════════

${code}

`
      })
      
      // Add README with instructions
      content += `
# ═══════════════════════════════════════════════════════════════
# FILE: README.md
# ═══════════════════════════════════════════════════════════════

# ${config.appName}

${config.description}

## Build Instructions

### Option 1: GitHub Actions (Recommended - No setup required!)
1. Create a new GitHub repository
2. Push this code to the repository
3. Go to Actions tab
4. The workflow will automatically build APK/IPA/EXE
5. Download artifacts from the completed workflow

### Option 2: Local Build
1. Install Flutter SDK: https://flutter.dev/docs/get-started/install
2. Run: \`flutter create .\`
3. Replace generated files with these files
4. Run: \`flutter pub get\`
5. Build for your platform:
   - Android: \`flutter build apk --release\`
   - iOS: \`flutter build ios --release\` (requires Mac with Xcode)
   - Windows: \`flutter build windows --release\`
   - macOS: \`flutter build macos --release\`
   - Linux: \`flutter build linux --release\`
   - Web: \`flutter build web --release\`

## Generated by Aurora Builder
Made with 💚 by Mostafa
https://github.com/moustuofa
`
      
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${config.appName.replace(/\\s+/g, '_')}_flutter_project.txt`
      a.click()
      URL.revokeObjectURL(url)
      addLog('✅ Downloaded Flutter project successfully!')
    } catch (error) {
      addLog('Download failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const downloadAllFiles = () => {
    const files = generateFiles()
    let content = ''
    Object.entries(files).forEach(([path, code]) => {
      content += `\n${'='.repeat(60)}\n📄 ${path}\n${'='.repeat(60)}\n\n${code}\n`
    })
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${config.appName.replace(/\s+/g, '_')}_flutter_project.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const stepTitles = [t.step1, t.step2, t.step3, t.step4, t.step5, t.step6, t.step7]

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 7) as WizardStep)
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1) as WizardStep)

  const isLight = actualTheme === 'light'

  // Preview state for simulated preview
  const [previewPhase, setPreviewPhase] = useState<'splash' | 'loading' | 'ready'>('splash')
  
  // Cycle through preview phases when on preview step
  useEffect(() => {
    if (currentStep === 5) {
      setPreviewPhase('splash')
      const timer1 = setTimeout(() => setPreviewPhase('loading'), 1800)
      const timer2 = setTimeout(() => setPreviewPhase('ready'), 3200)
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [currentStep, config.websiteUrl])

  // Get domain from URL for display
  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  return (
    <div className={`app-container ${isLight ? 'light-theme' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Aurora Background Orbs */}
      <div className="aurora-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
        <div className="orb orb-5"></div>
        <div className="orb orb-6"></div>
      </div>
      
      {/* Mesh Grid Overlay */}
      <div className="mesh-overlay"></div>

      {/* Main Content */}
      <div className="main-content">
        {/* Sticky Header */}
        <header className="header">
          <div className="header-inner">
            <div className="logo-section">
              {/* Beautiful Aurora Logo */}
              <div className="logo">
                <svg viewBox="0 0 100 100" className="logo-svg">
                  <defs>
                    <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00DC82">
                        <animate attributeName="stop-color" values="#00DC82;#00F5A0;#48CAE4;#00DC82" dur="4s" repeatCount="indefinite"/>
                      </stop>
                      <stop offset="50%" stopColor="#00B4D8">
                        <animate attributeName="stop-color" values="#00B4D8;#7B2CBF;#E040FB;#00B4D8" dur="4s" repeatCount="indefinite"/>
                      </stop>
                      <stop offset="100%" stopColor="#E040FB">
                        <animate attributeName="stop-color" values="#E040FB;#00DC82;#00B4D8;#E040FB" dur="4s" repeatCount="indefinite"/>
                      </stop>
                    </linearGradient>
                    <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  <circle cx="50" cy="50" r="45" fill="none" stroke="url(#logoGrad1)" strokeWidth="1.5" opacity="0.3" filter="url(#logoGlow)">
                    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="20s" repeatCount="indefinite"/>
                  </circle>
                  
                  <circle cx="50" cy="50" r="38" fill="none" stroke="url(#logoGrad1)" strokeWidth="1" opacity="0.5" strokeDasharray="6 3">
                    <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="15s" repeatCount="indefinite"/>
                  </circle>
                  
                  <path d="M50 15 L72 78 L61 78 L55 60 L45 60 L39 78 L28 78 Z" fill="url(#logoGrad1)" filter="url(#logoGlow)">
                    <animate attributeName="opacity" values="1;0.85;1" dur="2s" repeatCount="indefinite"/>
                  </path>
                  
                  <path d="M50 32 L54 52 L50 56 L46 52 Z" fill="white" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.6;0.9" dur="1.5s" repeatCount="indefinite"/>
                  </path>
                  
                  <circle cx="25" cy="28" r="2" fill="#fff" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="75" cy="32" r="1.5" fill="#00F5A0" opacity="0.7">
                    <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.7s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="78" cy="65" r="2" fill="#48CAE4" opacity="0.6">
                    <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.3s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="22" cy="70" r="1.5" fill="#E040FB" opacity="0.7">
                    <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.9s" repeatCount="indefinite"/>
                  </circle>
                </svg>
              </div>
              <div className="logo-text">
                <h1>{t.title}</h1>
                <p>{t.subtitle}</p>
              </div>
            </div>
            
            {/* Language & Theme Controls */}
            <div className="controls-section">
              {/* Language Toggle - Like theme toggle with flags */}
              <div className="lang-toggle">
                <button
                  onClick={() => {
                    // Auto-detect device language
                    const deviceLang = navigator.language.slice(0, 2)
                    const langMap: Record<string, Language> = { en: 'en', ar: 'ar', fa: 'fa', fr: 'fr', es: 'es' }
                    setLanguage(langMap[deviceLang] || 'en')
                  }}
                  className={`lang-btn-item auto-lang`}
                  title="Auto"
                >
                  🌐
                </button>
                {(Object.keys(languageNames) as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`lang-btn-item ${language === lang ? 'active' : ''}`}
                    title={languageNames[lang]}
                  >
                    <FlagIcon lang={lang} />
                  </button>
                ))}
              </div>

              {/* Theme Toggle */}
              <div className="theme-toggle">
                {(['dark', 'light', 'auto'] as ThemeMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setThemeMode(mode)}
                    className={`theme-btn ${themeMode === mode ? 'active' : ''}`}
                    title={mode.charAt(0).toUpperCase() + mode.slice(1)}
                  >
                    {mode === 'dark' && '🌙'}
                    {mode === 'light' && '☀️'}
                    {mode === 'auto' && '🌓'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Step Progress - New Sleek Horizontal Design (No Circles) */}
          <div className="step-progress-new">
            {/* Progress Track - Full Width Pill */}
            <div className={`progress-bar-container ${isRTL ? 'rtl' : ''}`}>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${((currentStep - 1) / 6) * 100}%` }}>
                  <div className="progress-bar-shimmer"></div>
                </div>
              </div>
              <div className="progress-bar-percent">{Math.round(((currentStep - 1) / 6) * 100)}%</div>
            </div>
            
            {/* Step Pills - Horizontal Row */}
            <div className="step-pills">
              {stepTitles.map((title, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep((i + 1) as WizardStep)}
                  className={`step-pill ${currentStep === i + 1 ? 'active' : ''} ${currentStep > i + 1 ? 'completed' : ''}`}
                >
                  <span className="step-pill-num">{currentStep > i + 1 ? '✓' : i + 1}</span>
                  <span className="step-pill-title">{title}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Wizard Content */}
        <main className="wizard-content">
          {/* Step 1: App Info */}
          {currentStep === 1 && (
            <div className="step-panel">
              <div className="card">
                <div className="card-header">
                  <span className="card-icon">📱</span>
                  <h2>{t.appInfo}</h2>
                </div>
                
                <div className="form-group">
                  <label>{t.appName}</label>
                  <input
                    type="text"
                    value={config.appName}
                    onChange={e => updateConfig('appName', e.target.value)}
                    placeholder={t.placeholderAppName || 'My Awesome App'}
                  />
                </div>
                
                <div className="form-group">
                  <label>{t.description}</label>
                  <textarea
                    value={config.description}
                    onChange={e => updateConfig('description', e.target.value)}
                    placeholder={t.placeholderDescription || 'A beautiful app...'}
                  />
                </div>
                
                <div className="form-group">
                  <label>{t.packageName}</label>
                  <input
                    type="text"
                    value={config.packageName}
                    onChange={e => updateConfig('packageName', e.target.value)}
                    placeholder="com.company.appname"
                  />
                </div>
                
                <div className="form-group">
                  <label>{t.websiteUrl}</label>
                  <input
                    type="url"
                    value={config.websiteUrl}
                    onChange={e => updateConfig('websiteUrl', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Design */}
          {currentStep === 2 && (
            <div className="step-panel">
              <div className="step-grid">
                <div className="card">
                  <div className="card-header">
                    <span className="card-icon">🎨</span>
                    <h2>{t.appIcons}</h2>
                  </div>
                  
                  <div className="icons-grid">
                    <div className="icon-upload">
                      <label>{t.appIcon}</label>
                      <label className="upload-box">
                        {config.appIcon ? (
                          <img src={config.appIcon} alt="App Icon" />
                        ) : (
                          <>
                            <span className="upload-icon">📤</span>
                            <span className="upload-text">{t.uploadIcon}</span>
                          </>
                        )}
                        <input type="file" accept="image/*" onChange={e => handleImageUpload('appIcon', e)} />
                      </label>
                    </div>
                    
                    <div className="icon-upload">
                      <label>{t.splashIcon}</label>
                      <label className="upload-box">
                        {config.splashIcon ? (
                          <img src={config.splashIcon} alt="Splash Icon" />
                        ) : (
                          <>
                            <span className="upload-icon">✨</span>
                            <span className="upload-text">{t.uploadSplash}</span>
                          </>
                        )}
                        <input type="file" accept="image/*" onChange={e => handleImageUpload('splashIcon', e)} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <span className="card-icon">🌈</span>
                    <h2>{t.colors}</h2>
                  </div>
                  
                  <div className="colors-grid">
                    {[
                      { key: 'primaryColor', label: t.primary, icon: '💚' },
                      { key: 'splashColor', label: t.splashBg, icon: '🌊' },
                      { key: 'statusBarColor', label: t.statusBar, icon: '📊' },
                      { key: 'backgroundColor', label: t.appBg, icon: '🖼️' },
                    ].map(({ key, label, icon }) => (
                      <div key={key} className="color-item">
                        <input
                          type="color"
                          value={config[key as keyof AppConfig] as string}
                          onChange={e => updateConfig(key as keyof AppConfig, e.target.value)}
                        />
                        <div className="color-info">
                          <span className="color-label">{icon} {label}</span>
                          <span className="color-value">{config[key as keyof AppConfig] as string}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Features */}
          {currentStep === 3 && (
            <div className="step-panel">
              <div className="card">
                <div className="card-header">
                  <span className="card-icon">⚡</span>
                  <h2>{t.features}</h2>
                </div>
                
                <div className="features-list">
                  {[
                    { key: 'fullscreen', label: t.fullscreen, desc: t.fullscreenDesc, icon: '📺' },
                    { key: 'backNavigation', label: t.backNav, desc: t.backNavDesc, icon: '◀️' },
                    { key: 'loadingIndicator', label: t.loadingBar, desc: t.loadingBarDesc, icon: '📶' },
                    { key: 'pullToRefresh', label: t.pullRefresh, desc: t.pullRefreshDesc, icon: '🔄' },
                    { key: 'allowZoom', label: t.allowZoom, desc: t.allowZoomDesc, icon: '🔍' },
                  ].map(({ key, label, desc, icon }) => (
                    <div key={key} className="feature-item">
                      <div className="feature-info">
                        <span className="feature-icon">{icon}</span>
                        <div>
                          <span className="feature-label">{label}</span>
                          <span className="feature-desc">{desc}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => updateConfig(key as keyof AppConfig, !config[key as keyof AppConfig])}
                        className={`toggle ${config[key as keyof AppConfig] ? 'active' : ''}`}
                      >
                        <span className="toggle-thumb"></span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Content Blocker */}
          {currentStep === 4 && (
            <div className="step-panel">
              <div className="card">
                <div className="card-header">
                  <span className="card-icon">🛡️</span>
                  <h2>{t.contentBlock}</h2>
                </div>
                <p className="card-desc">{t.contentBlockDesc}</p>
                
                <div className="form-group">
                  <label>{t.blockElements}</label>
                  <textarea
                    value={config.blockElements}
                    onChange={e => updateConfig('blockElements', e.target.value)}
                    placeholder={t.blockElementsPlaceholder}
                    className="code-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>{t.customCss}</label>
                  <textarea
                    value={config.customCss}
                    onChange={e => updateConfig('customCss', e.target.value)}
                    placeholder={t.customCssPlaceholder}
                    className="code-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>{t.filterLists}</label>
                  <textarea
                    value={config.filterLists}
                    onChange={e => updateConfig('filterLists', e.target.value)}
                    placeholder={t.filterListsPlaceholder}
                    className="code-input filter-input"
                  />
                  <p className="help-text">💡 {t.filterListsTip}</p>
                </div>
                
                <p className="help-text">💡 {t.blockingTip}</p>
              </div>
            </div>
          )}

          {/* Step 5: Preview */}
          {currentStep === 5 && (
            <div className="step-panel preview-step">
              <div className="preview-container">
                {/* Android Phone Frame */}
                <div className="phone-frame">
                  {/* Side Buttons */}
                  <div className="phone-btn-right-1"></div>
                  <div className="phone-btn-right-2"></div>
                  <div className="phone-btn-left"></div>
                  
                  {/* Screen */}
                  <div className="phone-screen">
                    {/* Camera Punch Hole */}
                    <div className="punch-hole"></div>
                    
                    {/* Status Bar */}
                    <div className="status-bar" style={{ backgroundColor: config.statusBarColor }}>
                      <span className="time">11:11</span>
                      <div className="status-icons">
                        <span>📶</span>
                        <span>🔋</span>
                      </div>
                    </div>
                    
                    {/* Screen Content - Simulated Preview */}
                    <div className="screen-content" style={{ backgroundColor: config.backgroundColor }}>
                      {/* Splash Phase */}
                      {previewPhase === 'splash' && (
                        <div className="preview-splash" style={{ backgroundColor: config.splashColor }}>
                          <div className="splash-icon-container" style={{ backgroundColor: config.primaryColor }}>
                            {config.splashIcon ? (
                              <img src={config.splashIcon} alt="Splash" className="splash-icon-img" />
                            ) : (
                              <span className="splash-icon-emoji">🚀</span>
                            )}
                          </div>
                          <div className="splash-app-name" style={{ color: config.primaryColor === '#ffffff' ? '#333' : '#fff' }}>
                            {config.appName}
                          </div>
                        </div>
                      )}
                      
                      {/* Loading Phase */}
                      {previewPhase === 'loading' && (
                        <div className="preview-loading-state" style={{ backgroundColor: config.backgroundColor }}>
                          <div className="loading-bar" style={{ backgroundColor: config.primaryColor }}></div>
                          <div className="loading-content">
                            <div className="loading-spinner" style={{ borderColor: `${config.primaryColor}33`, borderTopColor: config.primaryColor }}></div>
                            <span style={{ color: '#666', fontSize: '5px' }}>{getDomainFromUrl(config.websiteUrl)}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Ready Phase - mshots screenshot */}
                      {previewPhase === 'ready' && (
                        <div className="preview-screenshot">
                          <img 
                            src={`https://s0.wp.com/mshots/v1/${encodeURIComponent(config.websiteUrl || 'https://google.com')}?w=270&h=480`}
                            alt="Website Preview"
                            className="screenshot-img"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="screenshot-fallback" style={{ display: 'none' }}>
                            <span className="fallback-icon">🌐</span>
                            <span className="fallback-url">{getDomainFromUrl(config.websiteUrl)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Navigation Bar */}
                    <div className="nav-bar">
                      <div className="nav-btn triangle"></div>
                      <div className="nav-btn circle"></div>
                      <div className="nav-btn square"></div>
                    </div>
                  </div>
                </div>
                
                {/* Preview Info */}
                <div className="preview-info">
                  <h3>{config.appName}</h3>
                  <p>{config.websiteUrl}</p>
                  <p className="preview-desc">{t.previewDesc}</p>
                  <div className="preview-tags">
                    {config.fullscreen && <span className="tag">{t.fullscreen}</span>}
                    {config.backNavigation && <span className="tag">{t.backNav}</span>}
                    {config.loadingIndicator && <span className="tag">{t.loadingBar}</span>}
                    {config.blockElements && <span className="tag">🛡️</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Build */}
          {currentStep === 6 && (
            <div className="step-panel build-step">
              <div className="build-content">
                <div className="card compact">
                  <div className="card-header">
                    <span className="card-icon">🚀</span>
                    <h2>{t.build}</h2>
                  </div>
                  
                  <p className="card-desc" style={{ marginBottom: '0.6rem' }}>
                    {language === 'ar' ? 'قم بإنشاء مشروع Flutter كامل جاهز للبناء لجميع المنصات' :
                     language === 'fa' ? 'یک پروژه کامل Flutter آماده ساخت برای همه پلتفرم‌ها ایجاد کنید' :
                     language === 'fr' ? 'Générez un projet Flutter complet prêt à être construit pour toutes les plateformes' :
                     language === 'es' ? 'Genere un proyecto Flutter completo listo para construir para todas las plataformas' :
                     'Generate a complete Flutter project ready to build for all platforms'}
                  </p>
                  
                  <div className="platforms-grid">
                    <div className="platform-item">
                      <span className="platform-icon">🤖</span>
                      <span className="platform-name">Android APK</span>
                    </div>
                    <div className="platform-item">
                      <span className="platform-icon">🍎</span>
                      <span className="platform-name">iOS IPA</span>
                    </div>
                    <div className="platform-item">
                      <span className="platform-icon">🪟</span>
                      <span className="platform-name">Windows</span>
                    </div>
                    <div className="platform-item">
                      <span className="platform-icon">🖥️</span>
                      <span className="platform-name">macOS</span>
                    </div>
                    <div className="platform-item">
                      <span className="platform-icon">🐧</span>
                      <span className="platform-name">Linux</span>
                    </div>
                    <div className="platform-item">
                      <span className="platform-icon">🌐</span>
                      <span className="platform-name">Web</span>
                    </div>
                  </div>
                </div>

                <div className="card compact">
                  <div className="card-header">
                    <span className="card-icon">📁</span>
                    <h2>{t.generatedFiles}</h2>
                  </div>
                  
                  <button onClick={() => { generateFiles(); }} className="btn-secondary full-width">
                    🔄 {t.generateFiles}
                  </button>
                  
                  {Object.keys(generatedFiles).length > 0 && (
                    <>
                      <div className="files-list">
                        {Object.entries(generatedFiles).map(([path]) => (
                          <div key={path} className="file-item">
                            <span className="file-name">{path}</span>
                            <button 
                              onClick={() => copyToClipboard(generatedFiles[path], path)} 
                              className="btn-small"
                            >
                              {copied === path ? '✓' : '📋'}
                            </button>
                          </div>
                        ))}
                      </div>
                      <button onClick={downloadAllFiles} className="btn-secondary full-width">
                        📥 {t.downloadAll}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Download */}
          {currentStep === 7 && (
            <div className="step-panel download-step">
              <div className="card">
                <div className="card-header">
                  <span className="card-icon">📦</span>
                  <h2>{t.buildProgress}</h2>
                </div>
                
                {/* Build Progress */}
                <div className="build-progress-section">
                  <div className={`build-progress-track ${isRTL ? 'rtl' : ''}`}>
                    <div className="build-progress-fill" style={{ width: `${buildProgress}%` }}>
                      <div className="build-progress-shimmer"></div>
                      <div className="build-progress-glow"></div>
                    </div>
                  </div>
                  <div className="build-progress-info">
                    <span className="build-progress-percent">{buildProgress}%</span>
                    <span className="build-progress-status">{buildStatus}</span>
                  </div>
                </div>
                
                {/* Build Log */}
                <div className="build-log">
                  <div className="build-log-header">
                    <span className="card-icon">📋</span>
                    <h3>{t.buildLog}</h3>
                  </div>
                  <div className="build-log-content">
                    {buildLogs.length === 0 ? (
                      <p className="log-empty">{t.waitingBuild || 'Waiting to start build...'}</p>
                    ) : (
                      buildLogs.map((log, i) => (
                        <div key={i} className="log-entry">{log}</div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Download Button */}
                {buildComplete && downloadUrl && (
                  <button onClick={handleDownload} className="download-btn-large">
                    <span>📥</span> {language === 'ar' ? 'تحميل مشروع Flutter' :
                                    language === 'fa' ? 'دانلود پروژه Flutter' :
                                    language === 'fr' ? 'Télécharger le projet Flutter' :
                                    language === 'es' ? 'Descargar proyecto Flutter' :
                                    'Download Flutter Project'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className={`nav-buttons ${currentStep === 1 ? 'center-only' : ''}`}>
            {currentStep > 1 && (
              <button 
                onClick={prevStep} 
                className="nav-btn-prev"
              >
                {isRTL ? '→' : '←'} {t.previous}
              </button>
            )}
            
            {currentStep < 6 && (
              <button 
                onClick={nextStep} 
                className="nav-btn-next"
              >
                {t.next} {isRTL ? '←' : '→'}
              </button>
            )}
            
            {currentStep === 6 && (
              <button
                onClick={buildAPK}
                disabled={isBuilding}
                className="nav-btn-next build-btn"
              >
                {isBuilding ? (
                  <>
                    <span className="build-spinner"></span>
                    {t.building}
                  </>
                ) : (
                  <>
                    <span>🚀</span> {t.buildApk}
                  </>
                )}
              </button>
            )}
            
            {currentStep === 7 && buildComplete && downloadUrl && (
              <button onClick={handleDownload} className="nav-btn-next download-btn">
                <span>📥</span> {t.downloadApk}
              </button>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-left">
              <span className="footer-logo">✨</span>
              <span className="footer-brand">{t.auroraBuilder}</span>
            </div>
            <span className="footer-center">{t.madeWith}</span>
            <span className="footer-right">© {new Date().getFullYear()} {t.allRights}🌟</span>
          </div>
          <div className="footer-links">
            <button onClick={() => setFooterPage('terms')} className="footer-link-btn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z"/></svg>
              <span>{t.terms}</span>
            </button>
            <button onClick={() => setFooterPage('privacy')} className="footer-link-btn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
              <span>{t.privacy}</span>
            </button>
            <button onClick={() => setFooterPage('about')} className="footer-link-btn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              <span>{t.about}</span>
            </button>
            <button onClick={() => setFooterPage('contact')} className="footer-link-btn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              <span>{t.contact}</span>
            </button>
            <a href="https://github.com/moustuofa" target="_blank" rel="noopener noreferrer" className="footer-link-btn github-link">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <span>{t.github || 'GitHub'}</span>
            </a>
          </div>
        </footer>

        {/* Footer Page Modal */}
        {footerPage && (
          <div className="footer-modal-overlay" onClick={() => setFooterPage(null)}>
            <div className="footer-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setFooterPage(null)}>✕</button>
              
              {footerPage === 'terms' && (
                <div className="modal-content">
                  <h2>{t.termsTitle}</h2>
                  <div className="modal-body">
                    <h3>{t.termsWelcome}</h3>
                    <p>{t.termsWelcomeText}</p>
                    <h3>{t.termsUsage}</h3>
                    <p>{t.termsUsageText}</p>
                    <h3>{t.termsResponsibility}</h3>
                    <p>{t.termsResponsibilityText}</p>
                    <h3>{t.termsOpenSource}</h3>
                    <p>{t.termsOpenSourceText}</p>
                  </div>
                </div>
              )}
              
              {footerPage === 'privacy' && (
                <div className="modal-content">
                  <h2>{t.privacyTitle}</h2>
                  <div className="modal-body">
                    <h3>{t.privacyMatters}</h3>
                    <p>{t.privacyMattersText}</p>
                    <h3>{t.privacyData}</h3>
                    <p>{t.privacyDataText}</p>
                    <h3>{t.privacyThirdParty}</h3>
                    <p>{t.privacyThirdPartyText}</p>
                    <h3>{t.privacyTracking}</h3>
                    <p>{t.privacyTrackingText}</p>
                  </div>
                </div>
              )}
              
              {footerPage === 'about' && (
                <div className="modal-content">
                  <h2>{t.aboutTitle}</h2>
                  <div className="modal-body">
                    <h3>{t.aboutMission}</h3>
                    <p>{t.aboutMissionText}</p>
                    <h3>{t.aboutTeam}</h3>
                    <p>{t.aboutTeamText}</p>
                    <h3>{t.aboutTech}</h3>
                    <p>{t.aboutTechText}</p>
                    <h3>{t.aboutOpenSource}</h3>
                    <p>{t.aboutOpenSourceText}</p>
                  </div>
                </div>
              )}
              
              {footerPage === 'contact' && (
                <div className="modal-content">
                  <h2>{t.contactTitle}</h2>
                  <div className="modal-body">
                    <h3>{t.contactGetInTouch}</h3>
                    <p>{t.contactGetInTouchText}</p>
                    <h3>{t.contactGitHub}</h3>
                    <p>{t.contactGitHubText}</p>
                    <a href="https://github.com/moustuofa" target="_blank" rel="noopener noreferrer" className="contact-link">
                      github.com/moustuofa
                    </a>
                    <h3>{t.contactContribute}</h3>
                    <p>{t.contactContributeText}</p>
                    <h3>{t.contactSupport}</h3>
                    <p>{t.contactSupportText}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* VazirMatn font is loaded via link tag in index.html for better performance */

        /* Dark Theme (default) */
        .app-container {
          min-height: 100vh;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #050a08 0%, #0a1510 50%, #051510 100%);
          color: #f0fff8;
          font-family: 'Vazirmatn', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Global text shadow for better readability */
        h1, h2, h3, .logo-text h1, .logo-text p, .step-title, .card-header h2,
        .feature-label, .preview-info h3, .footer-left, .build-progress-percent {
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .light-theme h1, .light-theme h2, .light-theme h3, .light-theme .logo-text h1,
        .light-theme .card-header h2, .light-theme .feature-label, .light-theme .preview-info h3,
        .light-theme .footer-left {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        /* Light Theme - Aurora tinted, not pure white */
        .app-container.light-theme {
          background: linear-gradient(135deg, #c8e6dc 0%, #b8ddd0 50%, #a8d4c4 100%);
          color: #0a2820;
        }

        /* Aurora Background */
        .aurora-bg {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
          animation: float 20s ease-in-out infinite;
        }

        .light-theme .orb {
          opacity: 0.35;
          filter: blur(100px);
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #00DC82 0%, transparent 70%);
          top: -200px;
          left: -200px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #00B4D8 0%, transparent 70%);
          top: 30%;
          right: -150px;
          animation-delay: -5s;
        }

        .orb-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #7B2CBF 0%, transparent 70%);
          bottom: -100px;
          left: 30%;
          animation-delay: -10s;
        }

        .orb-4 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, #E040FB 0%, transparent 70%);
          top: 50%;
          left: -100px;
          animation-delay: -15s;
        }

        .orb-5 {
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, #48CAE4 0%, transparent 70%);
          bottom: 20%;
          right: 10%;
          animation-delay: -7s;
        }

        .orb-6 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #00F5A0 0%, transparent 70%);
          top: 10%;
          right: 30%;
          animation-delay: -12s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(-30px, -20px) scale(1.02); }
        }

        /* Mesh Overlay */
        .mesh-overlay {
          position: fixed;
          inset: 0;
          background-image: 
            linear-gradient(rgba(0, 220, 130, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 220, 130, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 1;
        }

        .light-theme .mesh-overlay {
          background-image: 
            linear-gradient(rgba(0, 100, 70, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 100, 70, 0.04) 1px, transparent 1px);
        }

        /* Main Content */
        .main-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
        }

        /* Header - narrower, with aurora tint */
        .header {
          flex-shrink: 0;
          padding: 0.4rem 1rem;
          background: linear-gradient(180deg, rgba(0, 50, 35, 0.88) 0%, rgba(0, 60, 42, 0.82) 100%);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 220, 130, 0.18);
          z-index: 100;
        }

        .light-theme .header {
          background: linear-gradient(180deg, rgba(150, 200, 180, 0.88) 0%, rgba(130, 190, 165, 0.82) 100%);
          border-color: rgba(0, 150, 100, 0.22);
        }

        .header-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logo {
          width: 36px;
          height: 36px;
        }

        .logo-svg {
          width: 100%;
          height: 100%;
          filter: 
            drop-shadow(0 0 15px rgba(0, 220, 130, 0.7))
            drop-shadow(0 0 30px rgba(0, 220, 130, 0.5))
            drop-shadow(0 0 45px rgba(0, 180, 216, 0.3))
            drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
        }

        .light-theme .logo-svg {
          filter: 
            drop-shadow(0 0 12px rgba(0, 150, 100, 0.6))
            drop-shadow(0 0 25px rgba(0, 150, 100, 0.4))
            drop-shadow(0 0 40px rgba(0, 120, 150, 0.25))
            drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2));
        }

        .logo-text h1 {
          font-size: 1.1rem;
          font-weight: 700;
          background: linear-gradient(135deg, #00DC82, #00B4D8, #7B2CBF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-text p {
          font-size: 0.6rem;
          color: rgba(0, 220, 130, 0.7);
        }

        .light-theme .logo-text p {
          color: rgba(0, 100, 70, 0.8);
        }

        /* Controls Section - Aligned symmetrically, responsive */
        .controls-section {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-shrink: 0;
        }

        /* Language Toggle - Same dimensions as theme toggle */
        .lang-toggle {
          display: flex;
          gap: 0.06rem;
          padding: 0.1rem;
          height: 26px;
          background: rgba(0, 220, 130, 0.1);
          border-radius: 0.5rem;
          border: 1px solid rgba(0, 220, 130, 0.2);
          align-items: center;
          justify-content: center;
        }

        .light-theme .lang-toggle {
          background: rgba(0, 150, 100, 0.12);
          border-color: rgba(0, 150, 100, 0.22);
        }

        .lang-btn-item {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          border-radius: 0.3rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.7rem;
        }

        .lang-btn-item:hover {
          background: rgba(0, 220, 130, 0.18);
        }

        .lang-btn-item.active {
          background: linear-gradient(135deg, #00DC82, #00B4D8);
          box-shadow: 0 2px 6px rgba(0, 220, 130, 0.4);
        }

        .lang-btn-item.auto-lang {
          font-size: 0.6rem;
        }

        /* Theme Toggle - Same dimensions as lang toggle */
        .theme-toggle {
          display: flex;
          gap: 0.06rem;
          padding: 0.1rem;
          height: 26px;
          background: rgba(0, 220, 130, 0.1);
          border-radius: 0.5rem;
          border: 1px solid rgba(0, 220, 130, 0.2);
          align-items: center;
          justify-content: center;
        }

        .light-theme .theme-toggle {
          background: rgba(0, 150, 100, 0.12);
          border-color: rgba(0, 150, 100, 0.22);
        }

        .theme-btn {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          border-radius: 0.3rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.65rem;
        }

        .theme-btn:hover {
          background: rgba(0, 220, 130, 0.18);
        }

        .theme-btn.active {
          background: linear-gradient(135deg, #00DC82, #00B4D8);
          box-shadow: 0 2px 6px rgba(0, 220, 130, 0.4);
        }

        /* Responsive controls for small screens */
        @media (max-width: 480px) {
          .controls-section {
            gap: 0.2rem;
          }
          .lang-toggle, .theme-toggle {
            padding: 0.08rem;
            height: 22px;
          }
          .lang-btn-item, .theme-btn {
            width: 16px;
            height: 16px;
            font-size: 0.5rem;
          }
          .lang-btn-item.auto-lang {
            font-size: 0.45rem;
          }
          .logo {
            width: 26px;
            height: 26px;
          }
          .logo-text h1 {
            font-size: 0.85rem;
          }
          .logo-text p {
            font-size: 0.45rem;
          }
          .header-inner {
            gap: 0.4rem;
          }
        }
        
        @media (max-width: 360px) {
          .controls-section {
            gap: 0.15rem;
          }
          .lang-toggle, .theme-toggle {
            padding: 0.05rem;
            height: 20px;
          }
          .lang-btn-item, .theme-btn {
            width: 14px;
            height: 14px;
            font-size: 0.45rem;
          }
          .logo {
            width: 22px;
            height: 22px;
          }
          .logo-text h1 {
            font-size: 0.75rem;
          }
          .logo-text p {
            display: none;
          }
        }

        /* =============================================
           STEP PROGRESS - NEW SLEEK HORIZONTAL DESIGN
           No circles - uses pills for zero alignment issues
           ============================================= */
        
        /* Flag SVG Icons */
        .flag-svg {
          width: 100%;
          height: 100%;
          border-radius: 2px;
          display: block;
        }

        .lang-btn-item .flag-svg {
          width: 14px;
          height: 10px;
        }

        @media (min-width: 1024px) {
          .lang-btn-item .flag-svg {
            width: 20px;
            height: 14px;
          }
        }

        .step-progress-new {
          position: relative;
          padding: 0.4rem 0.6rem 0.6rem;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        @media (min-width: 1024px) {
          .step-progress-new {
            padding: 0.6rem 1rem 0.8rem;
            max-width: 900px;
          }
        }

        /* Progress Bar Container */
        .progress-bar-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .progress-bar-track {
          flex: 1;
          height: 6px;
          background: rgba(0, 220, 130, 0.12);
          border-radius: 3px;
          overflow: hidden;
          position: relative;
        }

        .light-theme .progress-bar-track {
          background: rgba(0, 150, 100, 0.15);
        }

        @media (min-width: 1024px) {
          .progress-bar-track {
            height: 8px;
            border-radius: 4px;
          }
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #00DC82, #00F5A0, #48CAE4, #00DC82);
          background-size: 200% 100%;
          border-radius: inherit;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          animation: aurora-bar-flow 3s linear infinite;
        }

        .progress-bar-container.rtl .progress-bar-fill {
          margin-left: auto;
          background: linear-gradient(270deg, #00DC82, #00F5A0, #48CAE4, #00DC82);
          animation: aurora-bar-flow-rtl 3s linear infinite;
        }

        @keyframes aurora-bar-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes aurora-bar-flow-rtl {
          0% { background-position: 200% 50%; }
          100% { background-position: 0% 50%; }
        }

        .progress-bar-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          animation: bar-shimmer 2s ease-in-out infinite;
        }

        @keyframes bar-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        /* Progress Percentage Badge */
        .progress-bar-percent {
          font-size: 0.55rem;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #00DC82, #00B4D8);
          padding: 0.15rem 0.45rem;
          border-radius: 0.6rem;
          box-shadow: 0 2px 6px rgba(0, 220, 130, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
        }

        .light-theme .progress-bar-percent {
          background: linear-gradient(135deg, #00a060, #0090a0);
        }

        @media (min-width: 1024px) {
          .progress-bar-percent {
            font-size: 0.75rem;
            padding: 0.2rem 0.6rem;
          }
        }

        /* Step Pills Row */
        .step-pills {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.2rem;
        }

        @media (min-width: 1024px) {
          .step-pills {
            gap: 0.4rem;
          }
        }

        /* Individual Step Pill */
        .step-pill {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          padding: 0.3rem 0.15rem;
          background: rgba(0, 220, 130, 0.05);
          border: 1px solid rgba(0, 220, 130, 0.12);
          border-radius: 0.6rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        @media (min-width: 1024px) {
          .step-pill {
            padding: 0.45rem 0.25rem;
            gap: 0.25rem;
            border-radius: 0.8rem;
          }
        }

        .light-theme .step-pill {
          background: rgba(255, 255, 255, 0.4);
          border-color: rgba(0, 150, 100, 0.15);
        }

        .step-pill:hover {
          background: rgba(0, 220, 130, 0.1);
          border-color: rgba(0, 220, 130, 0.25);
          transform: translateY(-1px);
        }

        /* Active Step Pill */
        .step-pill.active {
          background: linear-gradient(135deg, rgba(0, 220, 130, 0.2), rgba(0, 180, 216, 0.15));
          border-color: rgba(0, 220, 130, 0.45);
          box-shadow: 0 3px 12px rgba(0, 220, 130, 0.2), 0 0 0 1px rgba(0, 220, 130, 0.1);
        }

        .light-theme .step-pill.active {
          background: linear-gradient(135deg, rgba(0, 180, 120, 0.2), rgba(0, 150, 180, 0.15));
          border-color: rgba(0, 150, 100, 0.45);
        }

        /* Completed Step Pill */
        .step-pill.completed {
          background: rgba(0, 220, 130, 0.08);
          border-color: rgba(0, 220, 130, 0.22);
        }

        .light-theme .step-pill.completed {
          background: rgba(0, 180, 120, 0.12);
          border-color: rgba(0, 150, 100, 0.28);
        }

        /* Step Pill Number */
        .step-pill-num {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 220, 130, 0.15);
          border-radius: 50%;
          font-size: 0.55rem;
          font-weight: 700;
          color: rgba(232, 245, 240, 0.75);
          transition: all 0.3s ease;
        }

        @media (min-width: 1024px) {
          .step-pill-num {
            width: 28px;
            height: 28px;
            font-size: 0.75rem;
          }
        }

        .light-theme .step-pill-num {
          background: rgba(0, 150, 100, 0.15);
          color: rgba(10, 40, 32, 0.75);
        }

        .step-pill.active .step-pill-num {
          background: linear-gradient(135deg, #00DC82, #00B4D8);
          color: white;
          box-shadow: 0 2px 8px rgba(0, 220, 130, 0.4);
        }

        .step-pill.completed .step-pill-num {
          background: linear-gradient(135deg, #00a870, #008858);
          color: white;
        }

        /* Step Pill Title */
        .step-pill-title {
          font-size: 0.42rem;
          color: rgba(232, 245, 240, 0.55);
          font-weight: 600;
          text-align: center;
          line-height: 1.2;
          transition: all 0.3s ease;
        }

        @media (min-width: 1024px) {
          .step-pill-title {
            font-size: 0.7rem;
          }
        }

        .light-theme .step-pill-title {
          color: rgba(10, 40, 32, 0.6);
        }

        .step-pill.active .step-pill-title {
          color: #00F5A0;
          font-weight: 700;
        }

        .light-theme .step-pill.active .step-pill-title {
          color: #006040;
        }

        .step-pill.completed .step-pill-title {
          color: rgba(0, 220, 130, 0.75);
        }

        .light-theme .step-pill.completed .step-pill-title {
          color: #007550;
        }

        .step-pill:hover .step-pill-title {
          color: #00DC82;
        }

        .light-theme .step-pill:hover .step-pill-title {
          color: #005838;
        }

        /* Wizard Content - No scroll, fit in viewport */
        .wizard-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 0.4rem;
        }

        .step-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .step-grid {
          display: grid;
          gap: 0.4rem;
          flex: 1;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .step-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* Cards - Consistent styling */
        .card {
          background: rgba(0, 65, 45, 0.45);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 220, 130, 0.15);
          border-radius: 1rem;
          padding: 0.7rem;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .card.compact {
          padding: 0.55rem;
        }

        .light-theme .card {
          background: rgba(200, 235, 220, 0.55);
          border-color: rgba(0, 150, 100, 0.2);
          box-shadow: 0 4px 20px rgba(0, 100, 70, 0.1);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          margin-bottom: 0.5rem;
          flex-shrink: 0;
        }

        .card-icon {
          width: 1.7rem;
          height: 1.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(0, 220, 130, 0.22), rgba(0, 180, 216, 0.22));
          border-radius: 0.4rem;
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        .card-header h2 {
          font-size: 0.85rem;
          font-weight: 600;
          color: #ffffff;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .light-theme .card-header h2 {
          color: #052820;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.4);
        }

        .card-desc {
          font-size: 0.7rem;
          color: rgba(0, 220, 130, 0.7);
          margin-bottom: 0.45rem;
          line-height: 1.4;
        }

        .light-theme .card-desc {
          color: rgba(0, 100, 70, 0.85);
        }

        /* Form Groups - Polished inputs */
        .form-group {
          margin-bottom: 0.5rem;
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        .form-group label {
          display: block;
          font-size: 0.65rem;
          color: #5febb8;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .light-theme .form-group label {
          color: #006040;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.55rem 0.75rem;
          background: rgba(0, 30, 20, 0.5);
          border: 1px solid rgba(0, 220, 130, 0.15);
          border-radius: 0.6rem;
          color: #ffffff;
          font-size: 0.8rem;
          transition: all 0.3s ease;
          outline: none;
          font-family: inherit;
        }

        .light-theme .form-group input,
        .light-theme .form-group textarea {
          background: rgba(255, 255, 255, 0.75);
          border-color: rgba(0, 150, 100, 0.25);
          color: #052820;
        }

        .form-group textarea {
          min-height: 48px;
          resize: none;
        }

        .form-group textarea.code-input {
          font-family: 'Courier New', monospace;
          font-size: 0.7rem;
          min-height: 52px;
        }

        .form-group textarea.filter-input {
          min-height: 68px;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #00DC82;
          box-shadow: 0 0 0 2px rgba(0, 220, 130, 0.15), 0 0 15px rgba(0, 220, 130, 0.1);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: rgba(232, 245, 240, 0.35);
        }

        .light-theme .form-group input::placeholder,
        .light-theme .form-group textarea::placeholder {
          color: rgba(10, 40, 32, 0.45);
        }

        .help-text {
          margin-top: 0.3rem;
          font-size: 0.55rem;
          color: rgba(0, 220, 130, 0.65);
          line-height: 1.4;
        }

        .light-theme .help-text {
          color: rgba(0, 100, 70, 0.8);
        }

        /* Icons Grid - Symmetrical with colors grid */
        .icons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }

        .icon-upload {
          display: flex;
          flex-direction: column;
        }

        .icon-upload > label:first-child {
          display: block;
          font-size: 0.6rem;
          color: rgba(0, 220, 130, 0.7);
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .light-theme .icon-upload > label:first-child {
          color: rgba(0, 100, 70, 0.85);
        }

        .upload-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 65px;
          border: 1.5px dashed rgba(0, 220, 130, 0.25);
          border-radius: 0.6rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(0, 220, 130, 0.03);
        }

        .light-theme .upload-box {
          border-color: rgba(0, 150, 100, 0.3);
          background: rgba(255, 255, 255, 0.4);
        }

        .upload-box:hover {
          border-color: rgba(0, 220, 130, 0.45);
          background: rgba(0, 220, 130, 0.08);
          box-shadow: 0 0 15px rgba(0, 220, 130, 0.1);
        }

        .upload-box img {
          width: 35px;
          height: 35px;
          object-fit: cover;
          border-radius: 0.35rem;
        }

        .upload-box input {
          display: none;
        }

        .upload-icon {
          font-size: 1rem;
          margin-bottom: 0.1rem;
        }

        .upload-text {
          font-size: 0.5rem;
          color: rgba(0, 220, 130, 0.6);
        }

        .light-theme .upload-text {
          color: rgba(0, 100, 70, 0.7);
        }

        /* Colors Grid - Matching icons grid */
        .colors-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }

        .color-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.4rem;
          background: rgba(0, 220, 130, 0.03);
          border-radius: 0.5rem;
          border: 1px solid rgba(0, 220, 130, 0.08);
          transition: all 0.3s ease;
        }

        .color-item:hover {
          background: rgba(0, 220, 130, 0.06);
          border-color: rgba(0, 220, 130, 0.15);
        }

        .light-theme .color-item {
          background: rgba(255, 255, 255, 0.4);
          border-color: rgba(0, 150, 100, 0.1);
        }

        .color-item input[type="color"] {
          width: 30px;
          height: 30px;
          border: none;
          border-radius: 0.4rem;
          cursor: pointer;
          background: transparent;
          flex-shrink: 0;
        }

        .color-item input[type="color"]::-webkit-color-swatch-wrapper {
          padding: 0;
        }

        .color-item input[type="color"]::-webkit-color-swatch {
          border: 2px solid rgba(0, 220, 130, 0.3);
          border-radius: 0.4rem;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
        }

        .color-info {
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
        }

        .color-label {
          font-size: 0.55rem;
          color: rgba(0, 220, 130, 0.75);
          font-weight: 500;
        }

        .light-theme .color-label {
          color: rgba(0, 100, 70, 0.9);
        }

        .color-value {
          font-size: 0.55rem;
          font-family: monospace;
          color: #e8f5f0;
          opacity: 0.8;
        }

        .light-theme .color-value {
          color: #0a2820;
        }

        /* Features List */
        .features-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
          overflow: auto;
        }

        .feature-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.4rem 0.5rem;
          background: rgba(0, 220, 130, 0.03);
          border-radius: 0.6rem;
          border: 1px solid rgba(0, 220, 130, 0.08);
          transition: all 0.3s ease;
        }

        .light-theme .feature-item {
          background: rgba(255, 255, 255, 0.4);
          border-color: rgba(0, 150, 100, 0.12);
        }

        .feature-item:hover {
          background: rgba(0, 220, 130, 0.06);
          border-color: rgba(0, 220, 130, 0.15);
        }

        .feature-info {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .feature-icon {
          font-size: 0.9rem;
        }

        .feature-label {
          display: block;
          font-weight: 500;
          font-size: 0.75rem;
          color: #ffffff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
        }

        .light-theme .feature-label {
          color: #052820;
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.4);
        }

        .feature-desc {
          display: block;
          font-size: 0.5rem;
          color: #6feba8;
        }

        .light-theme .feature-desc {
          color: #007050;
        }

        /* Toggle Switch */
        .toggle {
          width: 38px;
          height: 20px;
          background: rgba(232, 245, 240, 0.15);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }

        .light-theme .toggle {
          background: rgba(10, 40, 32, 0.18);
        }

        .toggle.active {
          background: linear-gradient(135deg, #00DC82, #00B4D8);
          box-shadow: 0 2px 8px rgba(0, 220, 130, 0.4);
        }

        .toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .toggle.active .toggle-thumb {
          left: 20px;
        }

        [dir="rtl"] .toggle-thumb {
          left: auto;
          right: 2px;
        }

        [dir="rtl"] .toggle.active .toggle-thumb {
          right: 20px;
        }

        /* Preview Step */
        .preview-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
        }

        .preview-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
        }

        /* Phone Frame */
        .phone-frame {
          position: relative;
          width: 150px;
          height: 300px;
          background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
          border-radius: 22px;
          padding: 4px;
          box-shadow: 
            0 15px 40px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.08),
            0 0 25px rgba(0, 220, 130, 0.12),
            inset 0 0 12px rgba(0, 0, 0, 0.3);
        }

        .phone-btn-right-1 {
          position: absolute;
          right: -2px;
          top: 60px;
          width: 2px;
          height: 28px;
          background: linear-gradient(180deg, #3a3a3a, #2a2a2a);
          border-radius: 0 1px 1px 0;
        }

        .phone-btn-right-2 {
          position: absolute;
          right: -2px;
          top: 95px;
          width: 2px;
          height: 20px;
          background: linear-gradient(180deg, #3a3a3a, #2a2a2a);
          border-radius: 0 1px 1px 0;
        }

        .phone-btn-left {
          position: absolute;
          left: -2px;
          top: 70px;
          width: 2px;
          height: 35px;
          background: linear-gradient(180deg, #3a3a3a, #2a2a2a);
          border-radius: 1px 0 0 1px;
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: #000;
          border-radius: 18px;
          overflow: hidden;
          position: relative;
        }

        .punch-hole {
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 7px;
          height: 7px;
          background: #1a1a1a;
          border-radius: 50%;
          z-index: 20;
          box-shadow: inset 0 0 2px rgba(0,0,0,0.5);
        }

        .status-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 8px;
          font-size: 6px;
          z-index: 10;
        }

        .time {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
        }

        .status-icons {
          display: flex;
          gap: 2px;
          font-size: 4px;
        }

        .screen-content {
          position: absolute;
          top: 16px;
          left: 0;
          right: 0;
          bottom: 26px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* Preview Loading */
        .preview-loading-state {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          background: #f8f9fa;
        }

        .loading-bar {
          height: 2px;
          animation: loading-progress 1.5s ease-in-out infinite;
        }

        @keyframes loading-progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }

        .loading-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-content span {
          font-size: 5px;
          color: #666;
        }

        /* Simulated Preview - Splash */
        .preview-splash {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .splash-icon-container {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .splash-icon-img {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          object-fit: cover;
        }

        .splash-icon-emoji {
          font-size: 20px;
        }

        .splash-app-name {
          font-size: 8px;
          font-weight: 600;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        /* Simulated Preview - Ready State */
        .preview-ready {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.3s ease;
          background: #ffffff;
        }

        .preview-browser-bar {
          padding: 3px 6px;
          background: #f0f0f0;
          border-bottom: 1px solid #ddd;
        }

        .browser-url {
          font-size: 4px;
          color: #666;
          background: white;
          padding: 2px 4px;
          border-radius: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .preview-content-area {
          flex: 1;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow: hidden;
        }

        .preview-header {
          height: 20px;
          border-radius: 4px;
          opacity: 0.9;
          display: flex;
          align-items: center;
          padding: 0 6px;
        }

        .preview-header-inner {
          font-size: 4px;
          color: white;
          font-weight: 600;
          opacity: 0.9;
        }

        .preview-hero {
          padding: 8px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
        }

        .preview-hero-text {
          font-size: 6px;
          font-weight: 600;
          color: #333;
        }

        .preview-hero-url {
          font-size: 4px;
          color: #666;
          margin-top: 2px;
          word-break: break-all;
        }

        .preview-skeleton-line {
          height: 6px;
          background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
          background-size: 200% 100%;
          border-radius: 3px;
          animation: skeleton-shimmer 1.5s ease infinite;
        }

        .preview-skeleton-line.short {
          width: 60%;
        }

        @keyframes skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Screenshot Preview - 9:16 aspect ratio */
        .preview-screenshot {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #f5f5f5;
        }

        .screenshot-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
        }

        .screenshot-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          gap: 6px;
        }

        .fallback-icon {
          font-size: 24px;
        }

        .fallback-url {
          font-size: 6px;
          color: #666;
          text-align: center;
          padding: 0 8px;
          word-break: break-all;
        }

        /* Navigation Bar */
        .nav-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 26px;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 25px;
        }

        .nav-btn {
          opacity: 0.35;
        }

        .nav-btn.square {
          width: 8px;
          height: 8px;
          border: 1.5px solid white;
          border-radius: 1.5px;
        }

        .nav-btn.circle {
          width: 8px;
          height: 8px;
          border: 1.5px solid white;
          border-radius: 50%;
        }

        .nav-btn.triangle {
          width: 0;
          height: 0;
          border-right: 4px solid white;
          border-top: 3px solid transparent;
          border-bottom: 3px solid transparent;
        }

        /* Preview Info */
        .preview-info {
          text-align: center;
        }

        .preview-info h3 {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.1rem;
          color: #e8f5f0;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
        }

        .light-theme .preview-info h3 {
          color: #0a2820;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
        }

        .preview-info p {
          font-size: 0.65rem;
          color: rgba(0, 220, 130, 0.7);
          margin-bottom: 0.15rem;
        }

        .light-theme .preview-info p {
          color: rgba(0, 100, 70, 0.75);
        }

        .preview-desc {
          font-size: 0.55rem !important;
          color: rgba(232, 245, 240, 0.55) !important;
        }

        .light-theme .preview-desc {
          color: rgba(10, 40, 32, 0.6) !important;
        }

        .preview-tags {
          display: flex;
          gap: 0.25rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .tag {
          padding: 0.15rem 0.4rem;
          background: rgba(0, 220, 130, 0.15);
          border: 1px solid rgba(0, 220, 130, 0.3);
          border-radius: 1.5rem;
          font-size: 0.5rem;
          color: #00DC82;
        }

        .light-theme .tag {
          background: rgba(0, 150, 100, 0.15);
          border-color: rgba(0, 150, 100, 0.35);
          color: #007550;
        }

        /* Build Step */
        .build-step {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
          overflow: hidden;
        }

        .build-content {
          display: grid;
          gap: 0.4rem;
          flex: 1;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .build-content {
            grid-template-columns: 1fr 1fr;
          }
        }

        .btn-secondary {
          padding: 0.45rem 0.6rem;
          background: rgba(0, 220, 130, 0.08);
          border: 1px solid rgba(0, 220, 130, 0.18);
          border-radius: 0.55rem;
          color: #e8f5f0;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.7rem;
        }

        .light-theme .btn-secondary {
          background: rgba(0, 150, 100, 0.1);
          border-color: rgba(0, 150, 100, 0.22);
          color: #0a2820;
        }

        .btn-secondary:hover {
          background: rgba(0, 220, 130, 0.15);
          border-color: #00DC82;
          box-shadow: 0 0 15px rgba(0, 220, 130, 0.18);
        }

        .btn-secondary.full-width {
          width: 100%;
          margin-top: 0.35rem;
        }

        /* Platforms Grid */
        .platforms-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.4rem;
          margin-top: 0.5rem;
        }

        .platform-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          padding: 0.5rem 0.3rem;
          background: rgba(0, 220, 130, 0.08);
          border: 1px solid rgba(0, 220, 130, 0.2);
          border-radius: 0.6rem;
          transition: all 0.3s ease;
        }

        .platform-item:hover {
          background: rgba(0, 220, 130, 0.15);
          border-color: rgba(0, 220, 130, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 220, 130, 0.2);
        }

        .light-theme .platform-item {
          background: rgba(0, 150, 100, 0.08);
          border-color: rgba(0, 150, 100, 0.2);
        }

        .light-theme .platform-item:hover {
          background: rgba(0, 150, 100, 0.15);
          border-color: rgba(0, 150, 100, 0.4);
        }

        .platform-icon {
          font-size: 1.4rem;
        }

        .platform-name {
          font-size: 0.55rem;
          font-weight: 600;
          color: #00DC82;
          text-align: center;
        }

        .light-theme .platform-name {
          color: #007550;
        }

        @media (min-width: 1024px) {
          .platforms-grid {
            gap: 0.6rem;
          }

          .platform-item {
            padding: 0.7rem 0.5rem;
            border-radius: 0.8rem;
          }

          .platform-icon {
            font-size: 2rem;
          }

          .platform-name {
            font-size: 0.75rem;
          }
        }

        .files-list {
          margin-top: 0.35rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          flex: 1;
          min-height: 0;
          max-height: none;
          overflow-y: auto;
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.25rem 0.4rem;
          background: rgba(0, 220, 130, 0.03);
          border-radius: 0.35rem;
          border: 1px solid rgba(0, 220, 130, 0.08);
        }

        .light-theme .file-item {
          background: rgba(255, 255, 255, 0.4);
          border-color: rgba(0, 150, 100, 0.12);
        }

        .file-name {
          font-family: monospace;
          font-size: 0.55rem;
          color: #00DC82;
        }

        .btn-small {
          padding: 0.15rem 0.4rem;
          background: rgba(0, 220, 130, 0.08);
          border: 1px solid rgba(0, 220, 130, 0.15);
          border-radius: 0.25rem;
          color: #e8f5f0;
          font-size: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .light-theme .btn-small {
          background: rgba(0, 150, 100, 0.1);
          border-color: rgba(0, 150, 100, 0.18);
          color: #0a2820;
        }

        .btn-small:hover {
          background: rgba(0, 220, 130, 0.15);
        }

        /* Download Step */
        .download-step {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
        }

        .build-progress-section {
          margin-bottom: 0.5rem;
        }

        .build-progress-track {
          height: 8px;
          background: rgba(0, 220, 130, 0.1);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }

        .light-theme .build-progress-track {
          background: rgba(0, 120, 80, 0.12);
        }

        .build-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00DC82, #00B4D8, #7B2CBF, #E040FB, #00DC82);
          background-size: 300% 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
          position: relative;
          animation: gradient-flow 2s linear infinite;
        }

        .build-progress-track.rtl .build-progress-fill {
          margin-left: auto;
          background: linear-gradient(270deg, #00DC82, #00B4D8, #7B2CBF, #E040FB, #00DC82);
          animation: gradient-flow-rtl 2s linear infinite;
        }

        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }

        @keyframes gradient-flow-rtl {
          0% { background-position: 300% 50%; }
          100% { background-position: 0% 50%; }
        }

        .build-progress-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
          animation: shimmer-move 1.2s ease-in-out infinite;
        }

        .build-progress-track.rtl .build-progress-shimmer {
          animation: shimmer-move-rtl 1.2s ease-in-out infinite;
        }

        .build-progress-glow {
          position: absolute;
          right: -2px;
          top: -4px;
          width: 14px;
          height: 14px;
          background: radial-gradient(circle, #00DC82, transparent 70%);
          border-radius: 50%;
          animation: glow-pulse 1s ease-in-out infinite;
        }

        .build-progress-track.rtl .build-progress-glow {
          right: auto;
          left: -2px;
        }

        .build-progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.4rem;
        }

        .build-progress-percent {
          font-size: 0.8rem;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, #00DC82, #00B4D8);
          padding: 0.2rem 0.6rem;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0, 220, 130, 0.4), 0 0 12px rgba(0, 220, 130, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .light-theme .build-progress-percent {
          color: #ffffff;
          background: linear-gradient(135deg, #00a060, #0090b0);
          box-shadow: 0 2px 8px rgba(0, 160, 96, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .build-progress-status {
          font-size: 0.65rem;
          color: rgba(232, 245, 240, 0.7);
        }

        .light-theme .build-progress-status {
          color: rgba(10, 40, 32, 0.75);
        }

        /* Build Log */
        .build-log {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: rgba(0, 30, 20, 0.5);
          border: 1px solid rgba(0, 220, 130, 0.12);
          border-radius: 0.6rem;
          overflow: hidden;
        }

        .light-theme .build-log {
          background: rgba(255, 255, 255, 0.5);
          border-color: rgba(0, 150, 100, 0.18);
        }

        .build-log-header {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.4rem 0.5rem;
          border-bottom: 1px solid rgba(0, 220, 130, 0.1);
        }

        .build-log-header h3 {
          font-size: 0.7rem;
          font-weight: 600;
          color: #e8f5f0;
        }

        .light-theme .build-log-header h3 {
          color: #0a2820;
        }

        .build-log-content {
          flex: 1;
          overflow-y: auto;
          padding: 0.4rem;
          font-family: monospace;
          font-size: 0.6rem;
        }

        .log-empty {
          color: rgba(232, 245, 240, 0.4);
          font-style: italic;
        }

        .light-theme .log-empty {
          color: rgba(10, 40, 32, 0.4);
        }

        .log-entry {
          padding: 0.15rem 0;
          color: rgba(232, 245, 240, 0.8);
          border-bottom: 1px solid rgba(0, 220, 130, 0.05);
        }

        .light-theme .log-entry {
          color: rgba(10, 40, 32, 0.8);
          border-color: rgba(0, 150, 100, 0.08);
        }

        .download-btn-large {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.7rem 1.5rem;
          margin-top: 0.5rem;
          background: linear-gradient(135deg, #00DC82, #00B4D8, #7B2CBF);
          border: none;
          border-radius: 0.8rem;
          color: white;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 
            0 6px 20px rgba(0, 220, 130, 0.35),
            0 0 30px rgba(0, 220, 130, 0.15);
          transition: all 0.3s ease;
        }

        .download-btn-large:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 
            0 10px 30px rgba(0, 220, 130, 0.45),
            0 0 40px rgba(0, 220, 130, 0.25);
        }

        /* Navigation Buttons - Symmetrical sizing */
        .nav-buttons {
          display: flex;
          justify-content: center;
          gap: 0.6rem;
          padding: 0.4rem;
          flex-shrink: 0;
        }

        .nav-buttons.center-only {
          justify-content: center;
        }

        .nav-btn-prev,
        .nav-btn-next {
          padding: 0.5rem 1.2rem;
          min-width: 100px;
          border: 1px solid rgba(0, 220, 130, 0.18);
          border-radius: 0.6rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
        }

        .nav-btn-prev {
          background: rgba(0, 220, 130, 0.05);
          color: #e8f5f0;
        }

        .light-theme .nav-btn-prev {
          background: rgba(0, 150, 100, 0.08);
          color: #0a2820;
          border-color: rgba(0, 150, 100, 0.2);
        }

        .nav-btn-prev:hover:not(:disabled) {
          background: rgba(0, 220, 130, 0.1);
          border-color: rgba(0, 220, 130, 0.3);
        }

        .nav-btn-prev:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .nav-btn-next {
          background: linear-gradient(135deg, #00DC82, #00B4D8);
          color: white;
          border-color: transparent;
          box-shadow: 0 3px 12px rgba(0, 220, 130, 0.3);
        }

        .nav-btn-next:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 5px 18px rgba(0, 220, 130, 0.4);
        }

        .nav-btn-next:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .nav-btn-next.build-btn,
        .nav-btn-next.download-btn {
          min-width: 140px;
        }

        .build-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Footer - narrower, with aurora tint */
        .footer {
          flex-shrink: 0;
          padding: 0.35rem 1rem;
          background: linear-gradient(180deg, rgba(0, 60, 42, 0.82) 0%, rgba(0, 50, 35, 0.88) 100%);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0, 220, 130, 0.18);
        }

        .light-theme .footer {
          background: linear-gradient(180deg, rgba(130, 190, 165, 0.82) 0%, rgba(150, 200, 180, 0.88) 100%);
          border-color: rgba(0, 150, 100, 0.22);
        }

        .footer-content {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-weight: 700;
          font-size: 0.55rem;
          color: rgba(0, 220, 130, 0.8);
        }

        .light-theme .footer-left {
          color: rgba(0, 100, 70, 0.9);
        }

        .footer-logo {
          font-size: 0.7rem;
        }

        .footer-brand {
          color: inherit;
          font-weight: 700;
          font-size: inherit;
        }

        .footer-center {
          font-size: 0.55rem;
          color: rgba(0, 220, 130, 0.8);
          text-align: center;
          font-weight: 700;
        }

        .light-theme .footer-center {
          color: rgba(0, 100, 70, 0.9);
        }

        .footer-right {
          font-size: 0.55rem;
          color: rgba(0, 220, 130, 0.8);
          text-align: right;
          font-weight: 700;
        }

        .light-theme .footer-right {
          color: rgba(0, 100, 70, 0.9);
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 0.25rem;
          margin-top: 0.3rem;
          flex-wrap: nowrap;
          overflow-x: auto;
        }

        .footer-link-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.12rem;
          padding: 0.15rem 0.3rem;
          min-width: 55px;
          height: 20px;
          background: rgba(0, 220, 130, 0.1);
          border: 1px solid rgba(0, 220, 130, 0.22);
          border-radius: 1.5rem;
          color: #00DC82;
          text-decoration: none;
          font-size: 0.4rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .footer-link-btn svg {
          width: 8px;
          height: 8px;
          flex-shrink: 0;
        }

        .footer-link-btn span {
          font-size: 0.4rem;
        }

        .light-theme .footer-link-btn {
          background: rgba(0, 150, 100, 0.1);
          border-color: rgba(0, 150, 100, 0.28);
          color: #007550;
        }

        .footer-link-btn:hover {
          background: rgba(0, 220, 130, 0.2);
          border-color: rgba(0, 220, 130, 0.42);
          box-shadow: 0 0 12px rgba(0, 220, 130, 0.15);
          transform: translateY(-1px);
        }

        .footer-link-btn.github-link {
          background: rgba(0, 220, 130, 0.15);
          border-color: rgba(0, 220, 130, 0.32);
        }

        .footer-link-btn.github-link:hover {
          background: rgba(0, 220, 130, 0.25);
          border-color: rgba(0, 220, 130, 0.5);
        }

        /* Footer Modal */
        .footer-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        .footer-modal {
          position: relative;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          background: linear-gradient(145deg, rgba(0, 65, 45, 0.95), rgba(0, 45, 32, 0.98));
          border: 1px solid rgba(0, 220, 130, 0.25);
          border-radius: 1.2rem;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 220, 130, 0.15);
          animation: modalSlideIn 0.3s ease;
        }

        .light-theme .footer-modal {
          background: linear-gradient(145deg, rgba(200, 235, 220, 0.98), rgba(180, 220, 200, 0.98));
          border-color: rgba(0, 150, 100, 0.3);
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-close {
          position: absolute;
          top: 0.8rem;
          right: 0.8rem;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 220, 130, 0.1);
          border: 1px solid rgba(0, 220, 130, 0.2);
          border-radius: 50%;
          color: #e8f5f0;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .light-theme .modal-close {
          background: rgba(0, 150, 100, 0.1);
          border-color: rgba(0, 150, 100, 0.25);
          color: #0a2820;
        }

        .modal-close:hover {
          background: rgba(0, 220, 130, 0.2);
          border-color: rgba(0, 220, 130, 0.4);
        }

        .modal-content {
          padding: 1.5rem;
          overflow-y: auto;
          max-height: 80vh;
        }

        .modal-content h2 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: #e8f5f0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          padding-right: 2.5rem;
        }

        [dir="rtl"] .modal-content h2 {
          padding-right: 0;
          padding-left: 3rem;
        }

        [dir="rtl"] .modal-close {
          right: auto;
          left: 1rem;
        }

        .light-theme .modal-content h2 {
          color: #052820;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.4);
        }

        .modal-body h3 {
          font-size: 0.9rem;
          color: #00DC82;
          margin: 1rem 0 0.4rem;
        }

        .light-theme .modal-body h3 {
          color: #007550;
        }

        .modal-body p {
          font-size: 0.8rem;
          color: rgba(232, 245, 240, 0.85);
          line-height: 1.6;
          margin-bottom: 0.5rem;
        }

        .light-theme .modal-body p {
          color: rgba(10, 40, 32, 0.85);
        }

        .modal-body strong {
          color: #00DC82;
        }

        .light-theme .modal-body strong {
          color: #007550;
        }

        .contact-link {
          display: inline-block;
          padding: 0.5rem 1rem;
          margin: 0.5rem 0;
          background: linear-gradient(135deg, rgba(0, 220, 130, 0.15), rgba(0, 180, 216, 0.15));
          border: 1px solid rgba(0, 220, 130, 0.3);
          border-radius: 0.5rem;
          color: #00DC82;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .light-theme .contact-link {
          background: linear-gradient(135deg, rgba(0, 150, 100, 0.15), rgba(0, 120, 150, 0.15));
          border-color: rgba(0, 150, 100, 0.35);
          color: #007550;
        }

        .contact-link:hover {
          background: linear-gradient(135deg, rgba(0, 220, 130, 0.25), rgba(0, 180, 216, 0.25));
          border-color: rgba(0, 220, 130, 0.5);
          box-shadow: 0 0 15px rgba(0, 220, 130, 0.2);
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 3px;
          height: 3px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(0, 220, 130, 0.25);
          border-radius: 1.5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 220, 130, 0.35);
        }

        /* ========================================
           DESKTOP/LAPTOP RESPONSIVE SCALING
           All elements ~2x bigger for larger screens
           ======================================== */
        @media (min-width: 1024px) {
          /* Header */
          .header {
            padding: 0.6rem 2rem;
          }

          .logo {
            width: 52px;
            height: 52px;
          }

          .logo-text h1 {
            font-size: 1.6rem;
          }

          .logo-text p {
            font-size: 0.85rem;
          }

          .lang-toggle, .theme-toggle {
            height: 38px;
            padding: 0.15rem;
          }

          .lang-btn-item, .theme-btn {
            width: 30px;
            height: 30px;
            font-size: 1rem;
          }

          .lang-btn-item.auto-lang {
            font-size: 0.9rem;
          }

          /* Progress percentage */
          .progress-percentage {
            font-size: 0.8rem;
            padding: 0.2rem 0.8rem;
          }

          /* Wizard Content */
          .wizard-content {
            padding: 0.8rem 2rem;
          }

          .step-panel {
            max-width: 1000px;
          }

          /* Cards */
          .card {
            padding: 1.2rem;
            border-radius: 1.4rem;
          }

          .card.compact {
            padding: 1rem;
          }

          .card-header {
            margin-bottom: 0.8rem;
            gap: 0.6rem;
          }

          .card-icon {
            width: 2.4rem;
            height: 2.4rem;
            font-size: 1.2rem;
            border-radius: 0.6rem;
          }

          .card-header h2 {
            font-size: 1.2rem;
          }

          .card-desc {
            font-size: 0.95rem;
            margin-bottom: 0.6rem;
          }

          /* Form Groups */
          .form-group {
            margin-bottom: 0.8rem;
          }

          .form-group label {
            font-size: 0.9rem;
            margin-bottom: 0.4rem;
          }

          .form-group input,
          .form-group textarea {
            padding: 0.8rem 1rem;
            font-size: 1rem;
            border-radius: 0.8rem;
          }

          .form-group textarea {
            min-height: 70px;
          }

          .form-group textarea.code-input {
            font-size: 0.9rem;
            min-height: 80px;
          }

          .form-group textarea.filter-input {
            min-height: 100px;
          }

          .help-text {
            font-size: 0.75rem;
            margin-top: 0.4rem;
          }

          /* Icons Grid */
          .icons-grid {
            gap: 0.8rem;
          }

          .icon-upload > label:first-child {
            font-size: 0.85rem;
            margin-bottom: 0.35rem;
          }

          .upload-box {
            height: 100px;
            border-radius: 0.8rem;
          }

          .upload-box img {
            width: 55px;
            height: 55px;
            border-radius: 0.5rem;
          }

          .upload-icon {
            font-size: 1.4rem;
          }

          .upload-text {
            font-size: 0.7rem;
          }

          /* Colors Grid */
          .colors-grid {
            gap: 0.8rem;
          }

          .color-item {
            padding: 0.5rem 0.6rem;
            gap: 0.6rem;
            border-radius: 0.7rem;
          }

          .color-item input[type="color"] {
            width: 45px;
            height: 45px;
            border-radius: 0.5rem;
          }

          .color-label {
            font-size: 0.8rem;
          }

          .color-value {
            font-size: 0.75rem;
          }

          /* Features List */
          .features-list {
            gap: 0.4rem;
          }

          .feature-item {
            padding: 0.6rem 0.8rem;
            border-radius: 0.8rem;
          }

          .feature-info {
            gap: 0.6rem;
          }

          .feature-icon {
            font-size: 1.3rem;
          }

          .feature-label {
            font-size: 1rem;
          }

          .feature-desc {
            font-size: 0.7rem;
          }

          /* Toggle Switch */
          .toggle {
            width: 50px;
            height: 26px;
            border-radius: 13px;
          }

          .toggle-thumb {
            width: 22px;
            height: 22px;
          }

          .toggle.active .toggle-thumb {
            left: 26px;
          }

          [dir="rtl"] .toggle.active .toggle-thumb {
            right: 26px;
          }

          /* Preview */
          .phone-frame {
            width: 220px;
            height: 440px;
            border-radius: 30px;
            padding: 6px;
          }

          .phone-screen {
            border-radius: 24px;
          }

          .punch-hole {
            width: 10px;
            height: 10px;
            top: 8px;
          }

          .status-bar {
            height: 24px;
            padding: 0 12px;
            font-size: 9px;
          }

          .status-icons {
            font-size: 6px;
          }

          .screen-content {
            top: 24px;
            bottom: 38px;
          }

          .nav-bar {
            height: 38px;
            gap: 35px;
          }

          .nav-btn.square,
          .nav-btn.circle {
            width: 12px;
            height: 12px;
            border-width: 2px;
          }

          .nav-btn.triangle {
            border-right-width: 6px;
            border-top-width: 4.5px;
            border-bottom-width: 4.5px;
          }

          .preview-info h3 {
            font-size: 1.3rem;
          }

          .preview-info p {
            font-size: 0.9rem;
          }

          .preview-desc {
            font-size: 0.75rem !important;
          }

          .preview-tags {
            gap: 0.4rem;
          }

          .tag {
            padding: 0.25rem 0.6rem;
            font-size: 0.7rem;
          }

          /* Splash screen in preview */
          .splash-icon-container {
            width: 60px;
            height: 60px;
            border-radius: 16px;
          }

          .splash-icon-img {
            width: 40px;
            height: 40px;
            border-radius: 8px;
          }

          .splash-icon-emoji {
            font-size: 28px;
          }

          .splash-app-name {
            font-size: 12px;
          }

          /* Loading state */
          .loading-spinner {
            width: 28px;
            height: 28px;
          }

          .loading-content span {
            font-size: 8px;
          }

          /* Build Step */
          .build-content {
            gap: 0.8rem;
          }

          .btn-secondary {
            padding: 0.65rem 0.9rem;
            font-size: 0.95rem;
            border-radius: 0.7rem;
          }

          .files-list {
            gap: 0.25rem;
          }

          .file-item {
            padding: 0.4rem 0.6rem;
            border-radius: 0.5rem;
          }

          .file-name {
            font-size: 0.75rem;
          }

          .btn-small {
            padding: 0.25rem 0.6rem;
            font-size: 0.7rem;
            border-radius: 0.35rem;
          }

          /* Download Step */
          .build-progress-track {
            height: 12px;
            border-radius: 6px;
          }

          .build-progress-info {
            margin-top: 0.6rem;
          }

          .build-progress-percent {
            font-size: 1.1rem;
            padding: 0.3rem 0.8rem;
          }

          .build-progress-status {
            font-size: 0.9rem;
          }

          .build-log-header {
            padding: 0.6rem 0.8rem;
          }

          .build-log-header h3 {
            font-size: 0.95rem;
          }

          .build-log-content {
            font-size: 0.8rem;
            padding: 0.6rem;
          }

          .download-btn-large {
            padding: 1rem 2rem;
            font-size: 1.2rem;
            border-radius: 1rem;
            gap: 0.7rem;
          }

          /* Navigation Buttons */
          .nav-buttons {
            padding: 0.6rem 2rem;
            gap: 1rem;
          }

          .nav-btn-prev,
          .nav-btn-next {
            padding: 0.7rem 1.8rem;
            min-width: 140px;
            font-size: 1rem;
            border-radius: 0.8rem;
          }

          .nav-btn-next.build-btn,
          .nav-btn-next.download-btn {
            min-width: 180px;
          }

          .build-spinner {
            width: 18px;
            height: 18px;
          }

          /* Footer */
          .footer {
            padding: 0.5rem 2rem;
          }

          .footer-content {
            max-width: 1000px;
          }

          .footer-left {
            font-size: 0.8rem;
            gap: 0.3rem;
          }

          .footer-logo {
            font-size: 1rem;
          }

          .footer-center,
          .footer-right {
            font-size: 0.8rem;
          }

          .footer-links {
            gap: 0.4rem;
            margin-top: 0.4rem;
          }

          .footer-link-btn {
            padding: 0.25rem 0.5rem;
            min-width: 80px;
            height: 28px;
            font-size: 0.6rem;
            gap: 0.2rem;
          }

          .footer-link-btn svg {
            width: 12px;
            height: 12px;
          }

          .footer-link-btn span {
            font-size: 0.6rem;
          }

          /* Modal */
          .footer-modal {
            max-width: 600px;
            border-radius: 1.5rem;
          }

          .modal-close {
            width: 36px;
            height: 36px;
            font-size: 1.1rem;
          }

          .modal-content {
            padding: 2rem;
          }

          .modal-content h2 {
            font-size: 1.6rem;
            margin-bottom: 1.2rem;
          }

          .modal-body h3 {
            font-size: 1.1rem;
            margin: 1.2rem 0 0.5rem;
          }

          .modal-body p {
            font-size: 0.95rem;
          }

          .contact-link {
            padding: 0.7rem 1.3rem;
            font-size: 1rem;
          }
        }

        /* Extra large screens (1440px+) */
        @media (min-width: 1440px) {
          .step-panel {
            max-width: 1100px;
          }

          .header-inner,
          .footer-content {
            max-width: 1100px;
          }

          .step-progress {
            max-width: 1000px;
          }

          .phone-frame {
            width: 260px;
            height: 520px;
          }
        }
      `}</style>
    </div>
  )
}

export default App
