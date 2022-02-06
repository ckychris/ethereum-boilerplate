import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { Button, Typography, Card, Tooltip } from "antd";
import { useVerifyMetadata } from "../../hooks/useVerifyMetadata";
import sanitizeHtml from "sanitize-html";

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    width: "100%",
    gap: "10px",
  },
};
const { Meta } = Card;

function CreateComic() {
  const { verifyMetadata } = useVerifyMetadata();

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        "https://api.nftport.xyz/v0/me/mints?chain=polygon",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "ee4f4cfb-1c25-4292-ae00-b1f766208539", //TODO env
          },
        },
      )
        .then((r) => r.json())
        .then((r) => r.minted_nfts);
      setData(res);
    };
    fetchData();
  }, [setData]);

  return (
    <div style={{ padding: "15px", maxWidth: "1030px", width: "100%" }}>
      <h1 style={{ marginBottom: "12px" }}>🖼 All comic books </h1>
      <div style={styles.NFTs}>
        {data.map((item) => {
          //Verify Metadata

          item = verifyMetadata(item);
          let comicBlock = null;

          try {
            comicBlock = JSON.parse(item?.metadata?.description);
          } catch (e) {
            console.log("invalid description format");
          }

          console.log(comicBlock);

          comicBlock = comicBlock || {
            text: "",
            name: "",
            image: null,
            token_address: "",
          };
          return (
            <Card
              hoverable
              style={{ width: 400, border: "2px solid #e7eaf3" }}
              cover={
                <article className="comic">
                  <div className={"panel" + " " + comicBlock.color}>
                    <img
                      src={item?.image || "error"}
                      alt=""
                      style={{
                        width: "100%",
                        objectFit: "contain",
                        height: "200px",
                      }}
                    />
                    <p
                      className={
                        comicBlock.type === "text"
                          ? "text top-left"
                          : "speech-left"
                      }
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(comicBlock.text),
                      }}
                    ></p>
                  </div>
                </article>
              }
              key={item.token_id}
            >
              <Meta title={item.token_id} description={item.metadata_uri} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default CreateComic;

// <li className="py-3 sm:py-4" key={item.token_id}>
//   <div className="flex items-center space-x-4">
//     <div className="flex-shrink-0">
//       <img
//         className="w-8 h-8 rounded-full"
//         width="100"
//         height="100"
//         src="https://flowbite.com/docs/images/people/profile-picture-4.jpg"
//         alt="Neil image"
//       />
//     </div>
//     <div className="flex-1 min-w-0">
//       <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
//         {item.token_id}
//       </p>
//       <p className="text-sm text-gray-500 truncate dark:text-gray-400">
//         Created: {item.mint_date}
//       </p>
//     </div>
//     <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
//       {item.metadata_uri}
//     </div>
//   </div>
// </li>
