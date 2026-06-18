import { Card, Col, Descriptions, DescriptionsProps, Row, Statistic } from "antd";
import { FeedbackRow } from "../feedback.type";
import { useMemo } from "react";
interface Props {
  data?: FeedbackRow[];
}

const FeedbackSummaryBar = ({ data }: Props) => {
  const summary = useMemo(() => {
    if (!data?.length) return;
    const processData = data.reduce(
      (pre, curr) => {
        pre.collection = (pre.collection || 0) + curr.collection;
        pre.valueForMoney = (pre.valueForMoney || 0) + curr.valueForMoney;
        pre.staffService = (pre.staffService || 0) + curr.staffService;

        const currRating =
          curr.collection + curr.valueForMoney + curr.staffService + curr.storeAmbience;
        pre.ambience = (pre.ambience || 0) + curr.storeAmbience;
        pre.sumAllAvgRating = pre.sumAllAvgRating + currRating / 4;
        if (curr.improvement?.length) {
          pre.suggestions++;
        }
        if (currRating === 20) {
          pre.fiveStarReviews++;
        }
        return pre;
      },
      {
        collection: 0,
        valueForMoney: 0,
        staffService: 0,
        ambience: 0,

        sumAllAvgRating: 0,
        fiveStarReviews: 0,
        suggestions: 0,
      },
    );
    const totalFeedbacks = data.length;

    return {
      totalFeedbacks,
      avgRating: processData.sumAllAvgRating / totalFeedbacks,

      avgCollection: processData.collection / totalFeedbacks,
      avgValueForMoney: processData.valueForMoney / totalFeedbacks,
      avgStaffService: processData.staffService / totalFeedbacks,
      avgAmbience: processData.ambience / totalFeedbacks,

      fiveStarReviews: processData.fiveStarReviews,
      suggestions: processData.suggestions,
    };
  }, [data]);

  const items: DescriptionsProps["items"] = summary && [
    {
      key: "1",
      label: "Collection",
      children: summary.avgCollection.toFixed(1),
    },
    {
      key: "2",
      label: "Value For Money",
      children: summary.avgValueForMoney.toFixed(1),
    },
    {
      key: "3",
      label: "Staff Service",
      children: summary.avgStaffService.toFixed(1),
    },
    {
      key: "4",
      label: "Ambience",
      children: summary.avgAmbience.toFixed(1),
    },
  ];
  return (
    <Row gutter={[8, 8]} style={{ margin: 8 }}>
      <Col xs={12} sm={12} md={4} lg={4} xl={4}>
        <Card size="small" variant="borderless">
          <Statistic title="Total Feedback" value={summary?.totalFeedbacks} />
        </Card>
      </Col>
      <Col xs={12} sm={12} md={4} lg={4} xl={4}>
        <Card size="small" variant="borderless">
          <Statistic title="Average Rating" value={summary?.avgRating} suffix="/ 5" precision={1} />
        </Card>
      </Col>
      <Col xs={10} sm={10} md={4} lg={4} xl={4}>
        <Card size="small" variant="borderless">
          <Statistic title="5-Star Reviews" value={summary?.fiveStarReviews} />
        </Card>
      </Col>
      <Col xs={14} sm={14} md={4} lg={4} xl={4}>
        <Card size="small" variant="borderless">
          <Statistic title="Improvement Suggestions" value={summary?.suggestions} />
        </Card>
      </Col>
      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <Card size="small" variant="borderless">
          <Descriptions size="small" column={2} title="Average Ratings" items={items} />
        </Card>
      </Col>
    </Row>
  );
};
export default FeedbackSummaryBar;
