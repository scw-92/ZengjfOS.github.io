var configs = {
    "title" : "Web Drawing",
    "author" : "zengjf",
    "blog" : "http://www.cnblogs.com/zengjfgit/",
    "github" : "https://github.com/ZengjfOS",
    "version" : "0.0.1",
    "language" : "en",
    "home_page" : {
        "show" : true,
        "Show_Time" : {
            "pages" : {
                "ser
				
				ial_assistant" : {
                    "index" : "001",
                    "type" : "html"
                }
            }
        }
    },
    "nav" : {
        // 列表的形式体现导航栏有多少项，模板中用来迭代下面的每一项
        "maps" : [
            {"Web绘图分析": "Demo_Analysis"}, 
            {"示例演示": "Show_Time"}, 
            /* {"My_Girl": "My_Girl"}, */
            {"持续学习": "Keep_Walk"}, 
            {"站点信息": "About"}
        ],
        "parts" : ["Demo_Analysis", "Show_Time", /* "My_Girl",*/ "Keep_Walk", "About"],
        "Demo_Analysis" : {
            "pages" : {
                /**
                 * 对于type是html类型且需要渲染的的page来说，文件夹的名称是$(index)_$(key)，例如：
                 * 001_javascript_control_svg_element = $(index)(0001)_$(key)(javascript_control_svg_element)
                 */
                "javascript_control_svg_element" : {
                    "index" : "001",
                    "type" : "html"
                }
            }
        },
        "Show_Time" : {
            "pages" : {
                "serial_assistant" : {
                    "index" : "001",
                    "type" : "html"
                }
            }
        },
        "My_Girl" : {
            "pages" : {
            }
        },
        "Keep_Walk" : {
            "pages" : {
                "AM335x_i.MX6DL_Ext_Interfaces" : {
                    "index" : "001",
                    "type" : "html",
                },
            }
        },
        "About" : {
            "pages" : {
                /**
                 * type为divider的类型是分隔符
                 */
                "divider1" : {
                    "type" : "divider",
                },
                /**
                 * type为linker的类型为直接的页面链接
                 */
                "Personal Blog" : {
                    "type" : "linker",
                    "url" : "http://www.cnblogs.com/zengjfgit/"
                },
                "GitHub Account" : {
                    "type" : "linker",
                    "url" : "https://github.com/ZengjfOS"
                },
                "GitHub Repository" : {
                    "type" : "linker",
                    "url" : "https://github.com/ZengjfOS/ZengjfOS.github.io"
                },
                "divider2" : {
                    "type" : "divider",
                },
                /**
                 * 对于type是html类型直接html或者Markdown文档，直接用网址
                 */
                "Website_WolkFlow" : {
                    "type" : "html",
                    "markdown" : "url",
                    "url" : "http://zorozeng.com/docs/001_WebSite_WorkFlow.html"
                },
                "Configuration_Information" : {
                    "type" : "html",
                    "markdown" : "url",
                    "url" : "http://zorozeng.com/docs/002_Configuration_Information.md"
                },
                "Website_Information" : {
                    "type" : "html",
                    "markdown" : "url",
                    "url" : "http://zorozeng.com/docs/003_Website_Information.md"
                },
                "README.md" : {
                    "type" : "html",
                    "markdown" : "url",
                    "url" : "http://zorozeng.com/README.md"
                }
            }
        }
    }
}
