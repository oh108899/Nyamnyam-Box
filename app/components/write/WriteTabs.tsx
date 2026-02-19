type TabType = "manual" | "ai";

interface WriteTabsProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
  tabBarClassName: string;
  tabButtonClassName: string;
  tabButtonActiveClassName: string;
}

export default function WriteTabs({
  activeTab,
  onChange,
  tabBarClassName,
  tabButtonClassName,
  tabButtonActiveClassName,
}: WriteTabsProps) {
  return (
    <div className={tabBarClassName}>
      <button
        type="button"
        className={`${tabButtonClassName} ${activeTab === "manual" ? tabButtonActiveClassName : ""}`}
        onClick={() => onChange("manual")}
      >
        레시피 작성
      </button>
      <button
        type="button"
        className={`${tabButtonClassName} ${activeTab === "ai" ? tabButtonActiveClassName : ""}`}
        onClick={() => onChange("ai")}
      >
        AI로 레시피 생성하기
      </button>
    </div>
  );
}
