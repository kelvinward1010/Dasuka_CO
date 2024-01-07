import { Typography } from "antd";

export default function LoadingCalculate(): JSX.Element {
  return (
    <div
      style={{
        position: "fixed",
        display: "flex",
        width: "100%",
        height: "100%",
        zIndex: 999,
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        padding: 16,
        background: "rgba(0, 0, 0, .25)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff",
          padding: 24,
          borderRadius: 10,
        }}
      >
        <div className="loadingio-spinner-spin-fh7l29mmbkr">
          <div className="ldio-rm9hs9qfarh">
            <div>
              <div></div>
            </div>
            <div>
              <div></div>
            </div>
            <div>
              <div></div>
            </div>
            <div>
              <div></div>
            </div>
            <div>
              <div></div>
            </div>
            <div>
              <div></div>
            </div>
            <div>
              <div></div>
            </div>
            <div>
              <div></div>
            </div>
          </div>
        </div>
        <Typography.Text style={{ fontSize: 16, color: "#1890ff" }} strong>
          Hệ thống đang đang rà soát lại NVL tồn...
        </Typography.Text>
      </div>
    </div>
  );
}
