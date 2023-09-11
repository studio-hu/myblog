// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: '全栈开发工程师养成记',
    tagline: '欢迎来到我的星球',
    favicon: 'img/favicon_logo.ico',

    // Set the production url of your site here
    url: 'https://studio-hu.github.io/',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'studio-hu', // Usually your GitHub org/user name.
    projectName: 'myblog', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                },
                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],
    plugins: [
        [
            '@docusaurus/plugin-content-docs',
            {
                id: 'docsJava',
                path: 'docsJava',
                routeBasePath: 'docsJava',
                // sidebarPath: require.resolve('./sidebars.js'),
                // ... other options
            },
        ],
    ],

    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            // Replace with your project's social card
            image: 'img/docusaurus-social-card.jpg',
            navbar: {
                title: '小胡的个人星球',
                logo: {
                    alt: 'My Site Logo',
                    src: 'img/logo_circle.png',
                },
                items: [
                    // {
                    //     // type: 'docSidebar',
                    //     // sidebarId: 'tutorialSidebar',
                    //     to:'/docs/intro',
                    //     position: 'left',
                    //     label: '学习笔记',
                    // },
                    {to: '/docsJava/category/JavaSE', label: 'Java基础', position: 'left'},
                    {to: '/blog', label: '博客', position: 'left'},
                    {
                        label: '更多',
                        position: 'left',
                        items: [
                            {to: '#', label: '(编写中...)'},
                        ],
                    },
                    {
                        href: 'https://github.com/studio-hu/myblog',
                        label: 'GitHub',
                        position: 'right',
                    },

                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: '文档',
                        items: [
                            {
                                label: 'Java基础',
                                to: '/docsJava/category/JavaSE',
                            },
                        ],
                    },
                    {
                        title: '社区',
                        items: [
                            {
                                label: 'Stack Overflow',
                                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
                            },
                            {
                                label: 'Discord',
                                href: 'https://discordapp.com/invite/docusaurus',
                            },
                            {
                                label: 'Twitter',
                                href: 'https://twitter.com/docusaurus',
                            },
                        ],
                    },
                    {
                        title: '更多',
                        items: [
                            {
                                label: 'Blog',
                                to: '/blog',
                            },
                            {
                                label: 'GitHub',
                                href: 'https://github.com/studio-hu/myblog',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} 小胡的个人星球.&nbsp;&nbsp;<a href="https://beian.miit.gov.cn">粤ICP备2022145980号</a>`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;
