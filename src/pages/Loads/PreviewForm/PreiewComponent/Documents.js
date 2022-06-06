import React from "react";

import Notes from "./Notes";

const Documents = () => {
  return (
    <>
      <div>
        <p>
          All the documents for this load are listed here. You can upload more
          documents by clicking on the "Upload Document" button.
        </p>
        {/* -----------------------------------------------------------call the notes component------------------------------------------------------------ */}
        <Notes name={"document"} />
      </div>
    </>
  );
};

export default Documents;
