import React, { useState } from "react";
import { useMoralis, useNFTBalances } from "react-moralis";
import {
  Card,
  Tooltip,
  Modal,
  Input,
  Skeleton,
  Form,
  Button,
  Upload,
  Select,
} from "antd";
import {
  FileSearchOutlined,
  SendOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { getExplorer } from "../../helpers/networks";
import AddressInput from "../AddressInput";
import { useVerifyMetadata } from "../../hooks/useVerifyMetadata";
import { InboxOutlined, PlusCircleOutlined } from "@ant-design/icons/lib/icons";
import sanitizeHtml from "sanitize-html";

const { Option } = Select;
const { Meta } = Card;

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

const normFile = (e) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const dummyRequest = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const CreateNFT = ({ creating, setCreating }) => {
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line
  const { account, isAuthenticated } = useMoralis();
  const onFinish = (values) => {
    if (!values?.dragger.length) return;
    setLoading(true);
    var data = new FormData();
    data.append("file", values.dragger[0].originFileObj);

    delete values.dragger;

    fetch(
      "https://api.nftport.xyz/v0/mints/easy/files?" +
        new URLSearchParams({
          chain: "polygon",
          name: values.name,
          description: JSON.stringify(values),
          mint_to_address: account,
        }),
      {
        method: "POST",
        body: data,
        headers: {
          //! TODO: move this to backend, exposed secret key
          Authorization: "ee4f4cfb-1c25-4292-ae00-b1f766208539",
        },
      },
    )
      .then((response) => response.json())
      .then((result) => {
        setCreating(false);
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => setLoading(false));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title={`Minting a new comic block`}
      visible={creating}
      footer={null}
      onCancel={() => setCreating(false)}
    >
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input a comic block name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Text"
          name="text"
          rules={[
            {
              required: true,
              message: "Please input a comic block text!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Color" name="color" initialValue="yellow">
          <Select defaultValue="yellow">
            <Option value="yellow">Yellow</Option>
            <Option value="blue">Blue</Option>
            <Option value="green">Green</Option>
            <Option value="red">Red</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Type" name="type" initialValue="text">
          <Select defaultValue="text">
            <Option value="text">Text</Option>
            <Option value="speech">Speech</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Dragger">
          <Form.Item
            name="dragger"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <Upload.Dragger
              name="files"
              customRequest={dummyRequest}
              maxCount={1}
              accept=".jpg,.jpeg,.png"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or image to this area to upload
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            disabled={!isAuthenticated}
            loading={loading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

function CreateComicBlock() {
  const { data: NFTBalances } = useNFTBalances();
  const { Moralis, chainId } = useMoralis();
  const [visible, setVisibility] = useState(false);
  const [creating, setCreating] = useState(false);
  const [receiverToSend, setReceiver] = useState(null);
  const [amountToSend, setAmount] = useState(null);
  const [nftToSend, setNftToSend] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { verifyMetadata } = useVerifyMetadata();

  async function transfer(nft, amount, receiver) {
    console.log(nft, amount, receiver);
    const options = {
      type: nft?.contract_type?.toLowerCase(),
      tokenId: nft?.token_id,
      receiver,
      contractAddress: nft?.token_address,
    };

    if (options.type === "erc1155") {
      options.amount = amount ?? nft.amount;
    }

    setIsPending(true);

    try {
      const tx = await Moralis.transfer(options);
      console.log(tx);
      setIsPending(false);
    } catch (e) {
      alert(e.message);
      setIsPending(false);
    }
  }

  const handleTransferClick = (nft) => {
    setNftToSend(nft);
    setVisibility(true);
  };

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  console.log("NFTBalances", NFTBalances);
  return (
    <div style={{ padding: "15px", maxWidth: "1030px", width: "100%" }}>
      <CreateNFT creating={creating} setCreating={setCreating} />
      <h1 style={{ marginBottom: "12px" }}>
        🖼 Your comic blocks{" "}
        <Button
          type="dashed"
          shape="circle"
          icon={<PlusCircleOutlined />}
          size="large"
          onClick={() => setCreating(true)}
        />
      </h1>
      <div style={styles.NFTs}>
        <Skeleton loading={!NFTBalances?.result}>
          {NFTBalances?.result &&
            NFTBalances.result.map((nft, index) => {
              //Verify Metadata
              nft = verifyMetadata(nft);
              let comicBlock = null;

              try {
                comicBlock = JSON.parse(nft?.metadata?.description);
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
                  actions={[
                    <Tooltip title="View On Blockexplorer">
                      <FileSearchOutlined
                        onClick={() =>
                          window.open(
                            `${getExplorer(chainId)}address/${
                              nft.token_address
                            }`,
                            "_blank",
                          )
                        }
                      />
                    </Tooltip>,
                    <Tooltip title="Transfer NFT">
                      <SendOutlined onClick={() => handleTransferClick(nft)} />
                    </Tooltip>,
                    <Tooltip title="Sell On OpenSea">
                      <ShoppingCartOutlined
                        onClick={() => alert("OPENSEA INTEGRATION COMING!")}
                      />
                    </Tooltip>,
                  ]}
                  style={{ width: 400, border: "2px solid #e7eaf3" }}
                  cover={
                    <article className="comic">
                      <div className={"panel" + " " + comicBlock.color}>
                        <img
                          src={nft?.image || "error"}
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
                  key={index}
                >
                  <Meta
                    title={comicBlock.name}
                    description={nft.token_address}
                  />
                </Card>
              );
            })}
        </Skeleton>
      </div>
      <Modal
        title={`Transfer ${nftToSend?.name || "NFT"}`}
        visible={visible}
        onCancel={() => setVisibility(false)}
        onOk={() => transfer(nftToSend, amountToSend, receiverToSend)}
        confirmLoading={isPending}
        okText="Send"
      >
        <AddressInput autoFocus placeholder="Receiver" onChange={setReceiver} />
        {nftToSend && nftToSend.contract_type === "erc1155" && (
          <Input
            placeholder="amount to send"
            onChange={(e) => handleChange(e)}
          />
        )}
      </Modal>
    </div>
  );
}

export default CreateComicBlock;
