document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const carouselInner = carousel.querySelector('.carousel-inner');
    const items = carousel.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    const totalItems = items.length;
    let slideInterval;
    let isReversed = false;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    const tabs = document.querySelectorAll('.tab_WxGrg');
    const contents = document.querySelectorAll('.item_5jee8');

    // 自动轮播
    function autoSlide() {
        if (currentIndex === totalItems - 1) {
            isReversed = true;
        } else if (currentIndex === 0) {
            isReversed = false;
        }

        if (isReversed) {
            currentIndex--;
        } else {
            currentIndex++;
        }
        updateCarousel();
    }

    // 更新轮播图位置
    function updateCarousel(transition = true) {
        if (transition) {
            carouselInner.style.transition = 'transform 0.8s ease-in-out';
        } else {
            carouselInner.style.transition = 'none';
        }
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // 开始轮播
    function startSlide() {
        slideInterval = setInterval(autoSlide, 5000);
    }

    // 停止轮播
    function stopSlide() {
        clearInterval(slideInterval);
    }

    // 处理触摸开始事件
    function handleTouchStart(e) {
        stopSlide();
        startX = e.touches[0].clientX;
        currentX = startX;
        isDragging = true;
        carouselInner.style.transition = 'none';
    }

    // 处理触摸移动事件
    function handleTouchMove(e) {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        const offset = (diff / carousel.offsetWidth) * 100;
        
        // 计算当前位置，考虑边界情况
        let newPosition = -currentIndex * 100 + offset;
        if (currentIndex === 0 && offset > 0) {
            newPosition = offset * 0.3; // 第一张向右拖动时增加阻尼
        } else if (currentIndex === totalItems - 1 && offset < 0) {
            newPosition = -currentIndex * 100 + offset * 0.3; // 最后一张向左拖动时增加阻尼
        }
        
        carouselInner.style.transform = `translateX(${newPosition}%)`;
    }

    // 处理触摸结束事件
    function handleTouchEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        const diff = currentX - startX;
        const threshold = carousel.offsetWidth * 0.2; // 20%的滑动阈值

        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentIndex > 0) {
                currentIndex--;
            } else if (diff < 0 && currentIndex < totalItems - 1) {
                currentIndex++;
            }
        }
        
        updateCarousel();
        startSlide();
    }

    // 初始化轮播
    startSlide();

    // 鼠标事件监听
    carousel.addEventListener('mouseenter', stopSlide);
    carousel.addEventListener('mouseleave', startSlide);

    // 触摸事件监听
    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: true });
    carousel.addEventListener('touchend', handleTouchEnd);

    // 常见问题展开/收起功能
    const questionItems = document.querySelectorAll('.item_F8jZc');
    
    questionItems.forEach(item => {
        const title = item.querySelector('.item_title_mL7ec');
        const content = item.querySelector('.item_value_GaBc3');
        const icon = title.querySelector('.icon_odcQR');
        
        // 初始状态：隐藏内容
        content.style.display = 'none';
        icon.textContent = '+';
        
        // 点击事件
        title.addEventListener('click', () => {
            const isOpen = content.style.display === 'block';
            
            // 切换显示状态
            content.style.display = isOpen ? 'none' : 'block';
            icon.textContent = isOpen ? '+' : '-';
            
            // 添加过渡动画
            if (!isOpen) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(-10px)';
                content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                
                // 触发重排以启动动画
                content.offsetHeight;
                
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }
        });
    });

    // 页脚链接展开/收起功能
    const footerTitles = document.querySelectorAll('.tips_title__U4Y1');
    
    footerTitles.forEach(title => {
        const icon = title.querySelector('.tips_title_icon_tpbGX');
        const nextItems = [];
        let nextElement = title.nextElementSibling;
        
        // 收集所有需要展开/收起的项目
        while (nextElement && nextElement.classList.contains('tips_item_ZkcFA')) {
            nextItems.push(nextElement);
            nextElement = nextElement.nextElementSibling;
        }
        
        // 初始状态：隐藏内容
        nextItems.forEach(item => {
            item.style.display = 'none';
        });
        icon.textContent = '+';
        
        // 点击事件
        title.addEventListener('click', () => {
            const isOpen = nextItems[0].style.display === 'block';
            
            // 切换显示状态
            nextItems.forEach(item => {
                item.style.display = isOpen ? 'none' : 'block';
                
                // 添加过渡动画
                if (!isOpen) {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-10px)';
                    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    
                    // 触发重排以启动动画
                    item.offsetHeight;
                    
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }
            });
            
            icon.textContent = isOpen ? '+' : '-';
        });
    });

    // 访问计数功能
    function updateVisitCount() {
        const countElement = document.querySelector('.ok_count_U2X1g');
        if (!countElement) return;

        // 获取存储的访问数据
        const storedData = localStorage.getItem('visitData');
        const now = new Date();
        let visitData;

        if (storedData) {
            visitData = JSON.parse(storedData);
            const lastVisit = new Date(visitData.lastVisit);
            
            // 检查是否过了一天
            if (now - lastVisit > 12 * 60 * 60 * 1000) {
                // 如果过了一天，重置计数
                visitData = {
                    count: 1,
                    lastVisit: now.toISOString()
                };
            } else {
                // 如果没过一天，增加计数
                visitData.count++;
                visitData.lastVisit = now.toISOString();
            }
        } else {
            // 首次访问
            visitData = {
                count: 1,
                lastVisit: now.toISOString()
            };
        }

        // 更新显示，添加"驗證紀錄"文本
        countElement.textContent = `${visitData.count} 驗證紀錄`;
        
        // 保存数据
        localStorage.setItem('visitData', JSON.stringify(visitData));
    }

    // 执行访问计数更新
    updateVisitCount();

    // 多级菜单展开/收起功能，适配嵌套结构
    function initializeMenu() {
        // 确保所有需要默认隐藏的菜单项和内容隐藏
        // 初始隐藏所有二级菜单容器 (.item2_aAzaY)，以及三级菜单和 lastInfo
        // 注意：不隐藏 item2_title_xGvQf，它们的显示由父容器控制
        const allContentsToHide = document.querySelectorAll('.item2_aAzaY, .item3_title__jyNj, .item3_title_new_yxTCj, .item2_lastinfo_U8TDH');
        allContentsToHide.forEach(content => {
            content.style.display = 'none';
        });

        // 确保所有图标初始为 '+'
        document.querySelectorAll('.item_count_RpPBp').forEach(icon => {
             if (icon) icon.textContent = '+';
        });


        // 一级菜单
        document.querySelectorAll('.item1_title_U9yIw').forEach(title => {
            const icon = title.querySelector('.item_count_RpPBp');
            // 收集所有后续的.item2_aAzaY，直到下一个.item1_title_U9yIw
            let nextElement = title.nextElementSibling;
            const contents = [];

            while (nextElement && !nextElement.classList.contains('item1_title_U9yIw')) {
                if (nextElement.classList.contains('item2_aAzaY')) {
                    contents.push(nextElement); // 收集二级菜单的容器div
                }
                nextElement = nextElement.nextElementSibling;
            }

            // 点击事件
            title.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();

                // 判断是否展开
                const isOpen = contents.length > 0 && contents[0].style.display === 'block';

                // 切换显示状态和动画
                contents.forEach(content => {
                     content.style.display = isOpen ? 'none' : 'block';
                     if (!isOpen) {
                        // 添加展开动画
                        content.style.opacity = '0';
                        content.style.transform = 'translateY(-10px)';
                        content.style.transition = 'opacity 0.3s, transform 0.3s';
                        // 强制浏览器重绘以应用初始状态
                        content.offsetHeight;
                        // 动画到最终状态
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    }
                });

                // 切换图标
                if (icon) icon.textContent = isOpen ? '+' : '-';
            };
        });

        // 二级菜单
        document.querySelectorAll('.item2_title_xGvQf').forEach(title => {
            const icon = title.querySelector('.item_count_RpPBp');
            let nextElement = title.nextElementSibling;
            const contents = [];

            // 检查下一个元素是否是 lastInfo，并收集三级菜单标题
            // 注意：lastInfo 和三级菜单都在同一个item2_aAzaY容器内，紧跟在 item2_title_xGvQf 后面
            // 收集紧跟在 .item2_title_xGvQf 后面的所有内容，直到遇到下一个 .item2_title_xGvQf 或父容器结束
             while (nextElement && !nextElement.classList.contains('item2_title_xGvQf') && !nextElement.classList.contains('item1_title_U9yIw')) { // 修改这里的停止条件
                 // 收集 lastInfo 和三级菜单标题
                if (nextElement.classList.contains('item2_lastinfo_U8TDH') ||
                    nextElement.classList.contains('item3_title__jyNj') ||
                    nextElement.classList.contains('item3_title_new_yxTCj')) {
                    contents.push(nextElement);
                } else if (nextElement.querySelectorAll) {
                    // 兼容被div包裹的情况，查找内部的三级菜单
                     nextElement.querySelectorAll('.item3_title__jyNj, .item3_title_new_yxTCj').forEach(sub => contents.push(sub));
                }
                nextElement = nextElement.nextElementSibling;
            }


            // 点击事件
            title.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();

                 // 判断是否展开
                const isOpen = contents.length > 0 && contents[0].style.display === 'block';

                // 切换显示状态和动画
                contents.forEach(content => {
                     content.style.display = isOpen ? 'none' : 'block';
                      if (!isOpen) {
                        // 添加展开动画
                        content.style.opacity = '0';
                        content.style.transform = 'translateY(-10px)';
                        content.style.transition = 'opacity 0.3s, transform 0.3s';
                        // 强制浏览器重绘以应用初始状态
                        content.offsetHeight;
                        // 动画到最终状态
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    }
                });

                // 切换图标
                if (icon) icon.textContent = isOpen ? '+' : '-';
            };
        });

         // 三级菜单
        document.querySelectorAll('.item3_title__jyNj, .item3_title_new_yxTCj').forEach(title => {
            const icon = title.querySelector('.item_count_RpPBp');
            let nextElement = title.nextElementSibling;
            const contents = [];

            // 收集所有子项
             while (nextElement && !nextElement.classList.contains('item3_title__jyNj') && !nextElement.classList.contains('item3_title_new_yxTCj') && !nextElement.classList.contains('item2_title_xGvQf') && !nextElement.classList.contains('item2_aAzaY') && !nextElement.classList.contains('item1_title_U9yIw')) { // 修改这里的停止条件
                 contents.push(nextElement);
                nextElement = nextElement.nextElementSibling;
            }

            // 初始隐藏子项
             contents.forEach(content => { content.style.display = 'none'; });
             if (icon) icon.textContent = '+'; // 三级菜单图标初始为 '+'


            // 点击事件
            title.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();

                // 判断是否展开
                const isOpen = contents.length > 0 && contents[0].style.display === 'block';

                // 切换显示状态和动画
                contents.forEach(content => {
                     content.style.display = isOpen ? 'none' : 'block';
                      if (!isOpen) {
                        // 添加展开动画
                        content.style.opacity = '0';
                        content.style.transform = 'translateY(-10px)';
                        content.style.transition = 'opacity 0.3s, transform 0.3s';
                        // 强制浏览器重绘以应用初始状态
                        content.offsetHeight;
                        // 动画到最终状态
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    }
                });

                // 切换图标
                 if (icon) icon.textContent = isOpen ? '+' : '-';
            };
        });
    }

    // 初始化菜单
    initializeMenu();

    // 侧边栏功能
    const sidebarModule = document.querySelector('.main_mnQNg');
    const sidebarContent = document.querySelector('.modal_BUPIl');
    const mask = document.querySelector('.mask_Mfk_M');
    const navButton = document.querySelector('.nav_I260C');

    // 初始化：隐藏侧边栏和遮罩层
    function initSidebar() {
        if (sidebarModule) sidebarModule.style.pointerEvents = 'none';
        if (sidebarContent) {
            sidebarContent.style.transition = 'left 0.3s';
            sidebarContent.style.left = '-95vw'; // 初始在屏幕外
        }
        if (mask) {
            mask.style.opacity = '0';
            mask.style.pointerEvents = 'none';
            mask.style.transition = 'opacity 0.3s';
        }
    }
    initSidebar();

    // 打开侧边栏（滑入）
    function openSidebar() {
        if (sidebarModule) sidebarModule.style.pointerEvents = 'auto';
        if (sidebarContent) sidebarContent.style.left = '0';
        if (mask) {
            mask.style.opacity = '1';
            mask.style.pointerEvents = 'auto';
        }
    }

    // 关闭侧边栏（滑出）
    function closeSidebar() {
        if (sidebarModule) sidebarModule.style.pointerEvents = 'none';
        if (sidebarContent) sidebarContent.style.left = '-90vw';
        if (mask) {
            mask.style.opacity = '0';
            mask.style.pointerEvents = 'none';
        }
    }

    // 点击按钮打开
    if (navButton) {
        navButton.addEventListener('click', function(e) {
            e.stopPropagation();
            openSidebar();
        });
    }

    // 点击遮罩关闭
    if (mask) {
        mask.addEventListener('click', closeSidebar);
        mask.addEventListener('touchstart', closeSidebar);
    }

    // 阻止点击侧边栏内容时冒泡到遮罩层
    if (sidebarContent) {
        ['click', 'touchstart', 'touchend'].forEach(evt => {
            sidebarContent.addEventListener(evt, function(e) {
                e.stopPropagation();
            });
        });
    }

    function showActiveTabContent() {
        let activeIdx = 0;
        tabs.forEach((tab, idx) => {
            if (tab.classList.contains('tab_ac_NsCRg')) {
                activeIdx = idx;
            }
        });
        contents.forEach((content, idx) => {
            content.style.display = idx === activeIdx ? 'block' : 'none';
        });
    }
    showActiveTabContent();

    tabs.forEach((tab, idx) => {
        tab.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止冒泡，防止关闭侧边栏
            // 切换高亮
            tabs.forEach(t => t.classList.remove('tab_ac_NsCRg'));
            tab.classList.add('tab_ac_NsCRg');
            // 切换内容
            contents.forEach((content, cidx) => {
                content.style.display = cidx === idx ? 'block' : 'none';
            });
        });
    });

    // 阻止点击 tabs_rjDxN 区域冒泡到遮罩层
    const tabsContent = document.querySelector('.tabs_rjDxN');
    if (tabsContent) {
        tabsContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // 阻止点击每个 item_5jee8 区域冒泡到遮罩层
    document.querySelectorAll('.item_5jee8').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
});
