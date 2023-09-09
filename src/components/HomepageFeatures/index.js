import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
    {
        title: 'React',
        imgUrl: "https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202309091658520.png",
        description: (
            <>
                用于构建 Web 和原生交互界面的库
            </>
        ),
    },
    {
        title: 'Spring Boot',
        imgUrl: "https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202309091705561.png",
        description: (
            <>
                Spring Boot是由Pivotal团队提供的全新框架，其设计目的是用来简化新Spring应用的初始搭建以及开发过程。该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置
            </>
        ),
    },
    {
        title: 'Redis',
        imgUrl: "https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202309091708308.png",
        description: (
            <>
                数百万开发人员用作数据库、缓存、流式处理引擎和消息代理的开源内存中数据存储。
            </>
        ),
    },

];

function Feature({imgUrl, title, description}) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <img  src={imgUrl} className={styles.featureSvg} alt={"图片"}/>
            </div>
            <div className="text--center padding-horiz--md">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures() {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
