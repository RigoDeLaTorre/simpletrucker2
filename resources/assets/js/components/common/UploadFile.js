import React from 'react'

const UploadFile = ({
  rateconfirmationPdfUrl,
  rateconfirmationFile,
  rateconfirmationFileName,
  handleFileChange,
  handleRemoveRateLink,
  handleRemoveBolLink,
  bolPdfUrl,
  bolFile,
  bolFileName,
  deleteRateConfirmation,
  deleteBol
}) => {
  return (
    <div className="file-upload-section">
      <div className="upload-group load-rateconfirmation">
        <div className={rateconfirmationPdfUrl ? 'pdf-link' : ''}>
          {rateconfirmationPdfUrl ? (
            <div className="upload-group__deleteContainer">
              <i
                className="material-icons upload-group__deleteButton"
                onClick={deleteRateConfirmation}>
                delete_forever
              </i>
              <a
                className="upload-group__attachment"
                href={`https://s3-us-west-1.amazonaws.com/simpletrucker/${rateconfirmationPdfUrl}`}
                target="_blank">
                <i className="material-icons tiny upload-group__attatch-icon">
                  attach_file
                </i>{' '}
                Rate Confirmation
              </a>
            </div>
          ) : (
            ''
          )}
        </div>

        <label className="custom-file-upload">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            name="rateconfirmation"
          />
          <i className="upload-icon material-icons tiny attatch-icon">
            cloud_upload
          </i>Rate Confirmation Upload
        </label>

        {rateconfirmationFileName ? (
          <div className="file-link-name">
            <a
              className="blob-url"
              href={URL.createObjectURL(rateconfirmationFile)}
              target="_blank">
              {rateconfirmationFileName}
            </a>
            <h4 className="remove-link" onClick={handleRemoveRateLink}>
              Cancel
            </h4>
          </div>
        ) : null}
      </div>
      <div className="upload-group load-bol">
        <div className={bolPdfUrl ? 'pdf-link' : ''}>
          {bolPdfUrl ? (
            <div className="upload-group__deleteContainer">
              <i
                className="material-icons upload-group__deleteButton"
                onClick={deleteBol}>
                delete_forever
              </i>
              <a
                className="upload-group__attachment"
                href={`https://s3-us-west-1.amazonaws.com/simpletrucker/${bolPdfUrl}`}
                target="_blank">
                <i className="material-icons tiny upload-group__attatch-icon">
                  attach_file
                </i>{' '}
                Proof of Delivery
              </a>
            </div>
          ) : (
            ''
          )}
        </div>
        <label className="custom-file-upload">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            name="bol"
          />
          <i className="upload-icon material-icons tiny">cloud_upload</i>Bill Of
          Lading Upload
        </label>

        {bolFileName ? (
          <div className="file-link-name">
            <a href={URL.createObjectURL(bolFile)} target="_blank">
              {bolFileName}
            </a>
            <h4 className="remove-link" onClick={handleRemoveBolLink}>
              Cancel
            </h4>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export { UploadFile }
