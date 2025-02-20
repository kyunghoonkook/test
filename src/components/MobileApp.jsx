import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

// Mock data
const CATEGORIES = ["카트", "Whook", "이벤트", "뉴스", "스토어", "홈"];
const BANNERS = [
  {
    id: 1,
    title: "M COUNTDOWN",
    subtitle: "글로벌 시청 투표",
    link: "https://example.com/1",
  },
  {
    id: 2,
    title: "Special Event",
    subtitle: "새로운 이벤트",
    link: "https://example.com/2",
  },
  {
    id: 3,
    title: "New Release",
    subtitle: "최신 업데이트",
    link: "https://example.com/3",
  },
];

// Styled Components
const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  max-width: 425px;
  margin: 0 auto;
  background-color: #f5f5f5;
  overflow: hidden;
  position: relative;
`;

const Header = styled.div`
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 48px;
`;

const Time = styled.span`
  font-size: 18px;
  font-weight: 600;
`;

const Icons = styled.div`
  display: flex;
  gap: 8px;
`;

const Icon = styled.div`
  width: 16px;
  height: 16px;
  background: black;
  border-radius: 50%;
`;

const TabContainer = styled.div`
  display: flex;
  background: white;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: #eaeaea;
  }
`;

const Tab = styled.button`
  padding: 12px 16px;
  white-space: nowrap;
  font-size: 14px;
  border: none;
  background: none;
  position: relative;
  color: ${(props) => (props.active ? "#FF1493" : "#666")};

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${(props) => (props.active ? "#FF1493" : "transparent")};
    transition: all 0.3s ease;
  }
`;

const BannerContainer = styled.div`
  position: relative;
  height: 192px;
  background: #6b46c1;
  overflow: hidden;
`;

const BannerSlider = styled.div`
  display: flex;
  transition: transform 0.3s ease;
  transform: translateX(-${(props) => props.active * 100}%);
`;

const Banner = styled.a`
  min-width: 100%;
  height: 192px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-decoration: none;
`;

const BannerTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const BannerSubtitle = styled.p`
  font-size: 16px;
`;

const Indicators = styled.div`
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const Indicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) =>
    props.active ? "white" : "rgba(255, 255, 255, 0.5)"};
  transition: background-color 0.3s ease;
`;

const CategoryContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 240px);
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  width: ${(props) => props.totalCategories * 100}%;
  height: 100%;
  transition: transform 0.3s ease;
  transform: translateX(
    -${(props) => (props.activeCategory * 100) / props.totalCategories}%
  );
`;

const CategoryContent = styled.div`
  width: ${100 / CATEGORIES.length}%;
  height: 100%;
  overflow-y: auto;
  flex-shrink: 0;
  padding-bottom: 60px; /* Footer height */
`;

const ContentList = styled.div`
  padding: 8px;
`;

const ListItem = styled.div`
  background: white;
  padding: 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ItemImage = styled.div`
  width: 100%;
  height: 96px;
  background: #eaeaea;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const ItemTitle = styled.h3`
  font-weight: 500;
`;

const LoadingText = styled.div`
  padding: 16px;
  text-align: center;
  color: #666;
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 0;
  width: 100%;
  max-width: 425px;
  background: white;
  border-top: 1px solid #eaeaea;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

const FooterText = styled.p`
  font-size: 12px;
  color: #666;
`;

const ScrollTopButton = styled.button`
  position: absolute;
  bottom: 70px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ff1493;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
  transition: opacity 0.3s ease;
  opacity: ${(props) => (props.visible ? "1" : "0")};
  pointer-events: ${(props) => (props.visible ? "all" : "none")};

  &:hover {
    background: #ff69b4;
  }

  &::before {
    content: "↑";
    font-size: 20px;
  }
`;

const MobileApp = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeBanner, setActiveBanner] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [categoryItems, setCategoryItems] = useState(
    CATEGORIES.map(() =>
      [...Array(10)].map((_, i) => ({ id: i, title: `Item ${i}` }))
    )
  );
  const [loading, setLoading] = useState(false);

  const touchStartX = useRef(null);
  const bannerIntervalRef = useRef(null);

  const handleCategoryClick = (index) => {
    setActiveCategory(index);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;

    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0 && activeCategory < CATEGORIES.length - 1) {
        setActiveCategory((prev) => prev + 1);
      } else if (diff < 0 && activeCategory > 0) {
        setActiveCategory((prev) => prev - 1);
      }
    }

    touchStartX.current = null;
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const rotateBanners = () => {
      setActiveBanner((prev) => (prev + 1) % BANNERS.length);
    };

    bannerIntervalRef.current = setInterval(rotateBanners, 3000);
    return () => clearInterval(bannerIntervalRef.current);
  }, []);

  const handleScroll = (e, categoryIndex) => {
    if (loading) return;

    const { scrollTop, scrollHeight, clientHeight } = e.target;

    setShowScrollTop(scrollTop > 200);

    const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;

    if (isNearBottom) {
      setLoading(true);

      // 만약 데이터를 받아온다면 여기서 업데이트됨
      setTimeout(() => {
        setCategoryItems((prev) => {
          const newItems = [...Array(5)].map((_, i) => ({
            id: prev[categoryIndex].length + i,
            title: `Item ${prev[categoryIndex].length + i}`,
          }));

          return prev.map((items, idx) =>
            idx === categoryIndex ? [...items, ...newItems] : items
          );
        });
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <AppContainer>
      <Header>
        <StatusBar>
          <Time>{currentTime}</Time>
          <Icons>
            <Icon />
            <Icon />
          </Icons>
        </StatusBar>
      </Header>

      <TabContainer>
        {CATEGORIES.map((category, index) => (
          <Tab
            key={category}
            active={activeCategory === index}
            onClick={() => handleCategoryClick(index)}
          >
            {category}
          </Tab>
        ))}
      </TabContainer>

      <BannerContainer>
        <BannerSlider active={activeBanner}>
          {BANNERS.map((banner) => (
            <Banner key={banner.id} href={banner.link} target="_blank">
              <BannerTitle>{banner.title}</BannerTitle>
              <BannerSubtitle>{banner.subtitle}</BannerSubtitle>
            </Banner>
          ))}
        </BannerSlider>
        <Indicators>
          {BANNERS.map((_, index) => (
            <Indicator key={index} active={activeBanner === index} />
          ))}
        </Indicators>
      </BannerContainer>

      <CategoryContainer>
        <MainContent
          activeCategory={activeCategory}
          totalCategories={CATEGORIES.length}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {CATEGORIES.map((_, categoryIndex) => (
            <CategoryContent
              key={categoryIndex}
              data-category={categoryIndex}
              onScroll={(e) => handleScroll(e, categoryIndex)}
            >
              <ContentList>
                {categoryItems[categoryIndex].map((item) => (
                  <ListItem key={item.id}>
                    <ItemImage />
                    <ItemTitle>{item.title}</ItemTitle>
                  </ListItem>
                ))}
                {loading && categoryIndex === activeCategory && (
                  <LoadingText>Loading more items...</LoadingText>
                )}
              </ContentList>
            </CategoryContent>
          ))}
        </MainContent>
      </CategoryContainer>

      <ScrollTopButton
        visible={showScrollTop}
        onClick={() => {
          const activeContent = document.querySelector(
            `[data-category="${activeCategory}"]`
          );
          if (activeContent) {
            activeContent.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
        }}
      />

      <Footer>
        <FooterText>© 2025 Mobile App. All rights reserved.</FooterText>
      </Footer>
    </AppContainer>
  );
};

export default MobileApp;
