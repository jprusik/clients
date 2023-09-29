import { AutofillOverlayPort } from "../../utils/autofill-overlay.enum";
import { AutofillOverlayIframeService as AutofillOverlayIframeServiceInterface } from "../abstractions/autofill-overlay-iframe.service";

import AutofillOverlayIframeService from "./autofill-overlay-iframe.service";

(global as any).chrome = {
        runtime: {
          getURL: function (path: string) {
            return "chrome-extension://id/overlay/list.html";
          },
          connect: (port: any) => {
            return {
              onDisconnect: {
                addListener: (eventsMessage: string, messageHandler: () => void) => {},
              },
              onMessage: {
                addListener: (eventsMessage: string, messageHandler: () => void) => {},
              },
            };
          },
        },
      };

describe("AutofillOverlayIframeService", () => {
  const iframePath = "overlay/list.html";
  let autofillOverlayIframeService: AutofillOverlayIframeServiceInterface | any;

  beforeEach(() => {
    const shadow = document.createElement("div").attachShadow({ mode: "open" });
    autofillOverlayIframeService = new AutofillOverlayIframeService(
      iframePath,
      AutofillOverlayPort.Button,
      shadow
    );
  });

  describe("initOverlayIframe", () => {
    it("sets up the iframe's attributes", () => {
      autofillOverlayIframeService.initOverlayIframe({ height: "0px" }, "title");
      const overlayIframe = autofillOverlayIframeService["iframe"];

      expect(overlayIframe.src).toEqual("chrome-extension://id/overlay/list.html");
      expect(overlayIframe.tabIndex).toEqual(-1);
      expect(overlayIframe.getAttribute("title")).toEqual("title");
      expect(overlayIframe.getAttribute("sandbox")).toEqual("allow-scripts");
      expect(overlayIframe.getAttribute("allowtransparency")).toEqual("true");
      expect(overlayIframe.getAttribute("style")).toContain("height: 0px;");
    });

    it("appends the iframe to the shadowDom", () => {
      jest.spyOn(autofillOverlayIframeService["shadow"], "appendChild");

      autofillOverlayIframeService.initOverlayIframe({ height: "0px" }, "title");
      const overlayIframe = autofillOverlayIframeService["iframe"];

      expect(autofillOverlayIframeService["shadow"].appendChild).toBeCalledWith(overlayIframe);
    });

    it("creates an aria alert element if the ariaAlert param is passed", () => {
      const ariaAlert = "aria alert";
      jest.spyOn(autofillOverlayIframeService, "createAriaAlertElement");

      autofillOverlayIframeService.initOverlayIframe({ height: "0px" }, "title", ariaAlert);

      expect(autofillOverlayIframeService.createAriaAlertElement).toBeCalledWith(ariaAlert);
    });

    describe("handlePortMessage", () => {
      it("", () => {
        autofillOverlayIframeService.initOverlayIframe({ top: "0px" }, "title");
        const overlayIframe = autofillOverlayIframeService["iframe"];
        const updatedStyles = { position: "relative", top: "40px" };
        const portMessage = { command: "updateIframePosition", styles: updatedStyles };
        const port = { name: autofillOverlayIframeService["portName"] };

        jest.spyOn(autofillOverlayIframeService, "setupPortMessageListener");
        jest.spyOn(autofillOverlayIframeService, "handlePortMessage");
        jest.spyOn(autofillOverlayIframeService, "updateIframePosition");
        jest.spyOn(
          autofillOverlayIframeService["backgroundPortMessageHandlers"],
          "updateIframePosition"
        );

        expect(overlayIframe.getAttribute("style")).toContain("top: 0px;");

        autofillOverlayIframeService["setupPortMessageListener"]();
        expect(autofillOverlayIframeService["setupPortMessageListener"]).toBeCalled();

        autofillOverlayIframeService["handlePortMessage"](portMessage, port);

        expect(autofillOverlayIframeService["handlePortMessage"]).toBeCalledWith(portMessage, port);
        expect(autofillOverlayIframeService["updateIframePosition"]).toBeCalledWith(updatedStyles);
        // expect(overlayIframe.getAttribute("style")).toContain("top: 40px;");
      });
    });

    /*
    it("updateElementStyles -> it updates the iframe's styling", () => {
      const overlayIframe = autofillOverlayIframeService["iframe"];
      autofillOverlayIframeService.initOverlayIframe({ top: "0px" }, "title");

      expect(overlayIframe.getAttribute("style")).toContain("top: 0px;");

      autofillOverlayIframeService["updateElementStyles"](
        overlayIframe,
        { position: "relative", top: "40px" },
      );

      expect(overlayIframe.getAttribute("style")).toContain("top: 40px;");
    });
    */
  });

  describe("handlePortMessage", () => {});
});
