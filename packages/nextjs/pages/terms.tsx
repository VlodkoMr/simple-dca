import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import React from "react";
import { OneStrategyStats } from "~~/components/OneStrategyStats";

const Terms: NextPage = () => {

  return (
    <>
      <MetaHeader />

      <div className={"container max-w-4xl"}>
        <h2 className={"text-center mt-6 mb-4"}>Terms & Conditions</h2>

        <div className={"mb-3"}>
          The site FlexDCA is a web browser application that provides users with the opportunity to deposit stablecoins into the
          smart-contract of the FlexDCA protocol that will be used to swap into destination cryptocurrency (based on selected strategy)
          using DCA. The user can withdraw the deposited stablecoins and received investments at any time.
        </div>

        <div className={"mb-16"}>
          <p className={"mb-3"}>PLEASE READ THESE TERMS CAREFULLY BEFORE USING THE APP. THESE TERMS GOVERN YOUR USE OF THE APP, UNLESS WE
            HAVE EXECUTED A
            SEPARATE
            WRITTEN AGREEMENT WITH YOU FOR THAT PURPOSE. WE ARE ONLY WILLING TO MAKE THE APP AVAILABLE TO YOU IF YOU ACCEPT ALL OF THESE
            TERMS. BY USING THE APP OR ANY PART OF IT, YOU ARE CONFIRMING THAT YOU UNDERSTAND AND AGREE TO BE BOUND BY ALL OF THESE TERMS.
            IF
            YOU ARE ACCEPTING THESE TERMS ON BEHALF OF A COMPANY OR OTHER LEGAL ENTITY, YOU REPRESENT THAT YOU HAVE THE LEGAL AUTHORITY TO
            ACCEPT THESE TERMS ON THAT ENTITY’S BEHALF AND BIND THAT ENTITY, IN WHICH CASE “YOU” WILL MEAN THAT ENTITY. IF YOU DO NOT HAVE
            SUCH AUTHORITY, OR IF YOU DO NOT ACCEPT ALL OF THESE TERMS, THEN WE ARE UNWILLING TO MAKE THE APP AVAILABLE TO YOU.
          </p>


          <p className={"mb-3"}>ANY PURCHASE OR SALE YOU MAKE, ACCEPT OR FACILITATE OUTSIDE OF THIS APP (AS DEFINED BELOW) OF A COLLECTIBLE
            WILL BE ENTIRELY AT
            YOUR RISK. WE DO NOT CONTROL OR ENDORSE PURCHASES OR SALES OF COLLECTIBLES OUTSIDE OF THIS APP. WE EXPRESSLY DENY ANY OBLIGATION
            TO INDEMNIFY YOU OR HOLD YOU HARMLESS FOR ANY LOSSES YOU MAY INCUR BY TRANSACTING, OR FACILITATING TRANSACTIONS INVOLVING
            COLLECTIBLES.
          </p>

          <p className={"mb-3"}>BY USING THE APP OR ANY PART OF IT OR INDICATING YOUR ACCEPTANCE IN AN ADJOINING BOX, YOU ARE CONFIRMING
            THAT YOU UNDERSTAND
            AND AGREE TO BE BOUND BY ALL OF THESE TERMS.
          </p>

          <p className={"mb-3"}>
            By using this App, you affirm that you are of legal age to enter into these Terms, and you accept and are bound by these Terms.
          </p>

          <p className={"mb-3"}>
            Any information in this document does not constitute a recommendation by any person to purchase tokens or either any other
            cryptographic token or currency and neither the Issuer has authorized any person to provide any of such recommendations.
          </p>

          <p className={"mb-3"}>
            Statements contained in this document may constitute forward-looking statements or speak to future events or plans. Such
            forward-looking statements or information involve known and unknown risks and uncertainties, which may cause occurring events to
            actually differ. Even errors, inaccuracies or omissions may occur in any such statement or information. Accordingly, no reliance
            should be placed on any such forward-looking statement or information, and any and all issued liability is disclaimed.
          </p>
        </div>
      </div>
    </>
  );
};

export default Terms;
