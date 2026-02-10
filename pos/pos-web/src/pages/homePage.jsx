import React from "react";
import { Layout, Menu, Carousel, Card, Row, Col, Button } from "antd";
import { Link } from "react-router-dom";
import "antd/dist/reset.css";

const { Header, Content, Footer } = Layout;

const categories = [
  { title: "Men's Fashion", image: "https://images.unsplash.com/photo-1521334884684-d80222895322" },
  {
    title: "Women's Fashion",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
  },
  { title: "Kids Wear", image: "https://images.unsplash.com/photo-1603252109303-2751441dd157" },
  { title: "Accessories", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f" },
];

const HomePage = () => {
  const scrollToHome = (e) => {
    e.preventDefault();
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
  };

  const menuItems = [
    {
      key: "logo",
      // icon: <MailOutlined />,
      label: <span style={{ fontWeight: 600 }}>Organic Design</span>,
    },
    {
      key: "right",
      type: "group",
      // icon: <MailOutlined />,
      children: [
        {
          key: "home",
          label: (
            <a href="#home" onClick={scrollToHome}>
              Home
            </a>
          ),
        },
        {
          key: "login",
          label: <Link to="/login">Login</Link>,
        },
      ],
    },
  ];
  return (
    <Layout>
      {/* Navbar */}
      <Header style={{ position: "sticky", top: 0, zIndex: 1000 }}>
        <Menu
          // theme="dark"
          mode="horizontal"
          selectable={false}
          style={{ display: "flex", justifyContent: "space-between" }}
          items={menuItems}
        />
      </Header>

      <Content>
        {/* Banner */}
        <div id="home">
          <Carousel autoplay effect="fade">
            {["Premium Fashion Collection", "Trendy Styles for Everyone", "Discover Your Look"].map(
              (text, i) => (
                <div key={i}>
                  <div
                    style={{
                      height: 420,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 36,
                      fontWeight: 600,
                      background:
                        "linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4)), url(https://images.unsplash.com/photo-1445205170230-053b83016050)",
                      backgroundSize: "cover",
                    }}
                  >
                    {text}
                  </div>
                </div>
              ),
            )}
          </Carousel>
        </div>

        {/* Categories */}
        <div style={{ padding: "60px 40px" }}>
          <h2 style={{ textAlign: "center", marginBottom: 40 }}>Product Categories</h2>
          <Row gutter={[24, 24]} justify="center">
            {categories.map((cat) => (
              <Col xs={24} sm={12} md={6} key={cat.title}>
                <Card
                  hoverable
                  cover={
                    <img
                      src={cat.image}
                      alt={cat.title}
                      style={{ height: 220, objectFit: "cover" }}
                    />
                  }
                >
                  <Card.Meta title={cat.title} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: 60, background: "#fafafa" }}>
          <h2>Looking for bulk orders or custom designs?</h2>
          <Button type="primary" size="large">
            Contact Us
          </Button>
        </div>

        {/* Contact */}
        <div style={{ padding: "60px 40px" }}>
          <Row gutter={32}>
            <Col xs={24} md={12}>
              <h2>Contact Us</h2>
              <p>
                <b>Address:</b> Moylar Mor, Sonargaon Janapath Rd, Dhaka 1230, Bangladesh
              </p>
              <p>
                <b>Email:</b> info@organicdesignbd.com
              </p>
              <p>
                <b>Phone:</b> +8801973300862
              </p>
            </Col>
            <Col xs={24} md={12}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.4333544845163!2d90.37914028341244!3d23.87424722881381!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c50017d77ac1%3A0x435d1921a57c8474!2zTW95bGFyIE1vciAtIOCmruCmr-CmvOCmsuCmvuCmsCDgpq7gp4vgpqHgprw!5e0!3m2!1sen!2sus!4v1769279863308!5m2!1sen!2sus"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Col>
          </Row>
        </div>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        © {new Date().getFullYear()} Organic Design. All rights reserved.
      </Footer>
    </Layout>
  );
};
export default HomePage;
