import React, { useState ,useEffect} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaTag } from "react-icons/fa";
function AssignTagModal({url_id,handleUrlTagAddButton}) {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
  }, [localStorage.getItem("accessToken")]);
    const [show, setShow] = useState(false);
    const [shortUrl,setShortUrl]=useState();
    const[tag_name,setTagName]=useState(""); //url tag name to be updated

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  useEffect(() => {
    if (show) {
      const fetchUrlData = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/urls/${url_id}`,
            {
              headers: {
                "Authorization": `Bearer ${accessToken}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const url = await response.json();
          setShortUrl(url.short_url);
          console.log(" URL = ", url);
        } catch (error) {
          console.error("Error fetching url:", error);
        }
      };
      fetchUrlData();
    }
  }, [show]);
  return (
    <>
      <button onClick={handleShow} type="button" className="btn tag-btn">
        <FaTag />
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Tag URL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="assign-tag-modal">
          <form
            onSubmit={(e) => {
              handleClose();
              e.preventDefault();
              handleUrlTagAddButton(tag_name);
            }}
            id="assign-tag-form"
            className="w-full max-w-sm"
          >
            {/* tag name */}
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="tag-name"
                >
                  <strong> Tag Name:</strong>
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="tag-name"
                  name="tag-name"
                  type="text"
                  maxLength={50}
                  required
                  value={tag_name}
                  onChange={(e) => {
                    setTagName(e.target.value);
                  }}
                />
              </div>
            </div>
          </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="btn btn-primary"
            onClick={handleClose}
          >
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AssignTagModal;
