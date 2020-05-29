import React, { useCallback } from "react";
import { SvgIcon, SvgIconProps } from "@material-ui/core";

// These sizes are obtained by inspecting the actual SVG created by Mapbox:
export const defaultMarkerWidth = 27;
export const defaultMarkerHeight = 41;
// export const defaultMarkerColor = "#3FB1CE";
export const defaultMarkerColor = "#639dab";
export const highlightedMarkerColor = "red";
export const submittedDataMarkerColor = "orange";

type Props = SvgIconProps & { iconColor: string };
const MapMarker = (props: Props) => {
  const { iconColor: color, ...rest } = props;
  const drawMarker = useCallback((svg: SVGSVGElement | null) => {
    if (svg !== null) {
      // Create default map marker. Adapted from
      // https://github.com/mapbox/mapbox-gl-js/blob/d0f42e4274a0972f27c1e7f1546aea58491d2a4c/src/ui/marker.js#L100-L191
      const defaultHeight = 41;
      const defaultWidth = 27;
      svg.setAttributeNS(null, "display", "block");
      svg.setAttributeNS(null, "height", `${defaultHeight}px`);
      svg.setAttributeNS(null, "width", `${defaultWidth}px`);
      svg.setAttributeNS(
        null,
        "viewBox",
        `0 0 ${defaultWidth} ${defaultHeight}`
      );

      const markerLarge = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      markerLarge.setAttributeNS(null, "stroke", "none");
      markerLarge.setAttributeNS(null, "stroke-width", "1");
      markerLarge.setAttributeNS(null, "fill", "none");
      markerLarge.setAttributeNS(null, "fill-rule", "evenodd");

      const page1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
      page1.setAttributeNS(null, "fill-rule", "nonzero");

      const shadow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      shadow.setAttributeNS(null, "transform", "translate(3.0, 29.0)");
      shadow.setAttributeNS(null, "fill", "#000000");

      const ellipses = [
        { rx: "10.5", ry: "5.25002273" },
        { rx: "10.5", ry: "5.25002273" },
        { rx: "9.5", ry: "4.77275007" },
        { rx: "8.5", ry: "4.29549936" },
        { rx: "7.5", ry: "3.81822308" },
        { rx: "6.5", ry: "3.34094679" },
        { rx: "5.5", ry: "2.86367051" },
        { rx: "4.5", ry: "2.38636864" },
      ];

      for (const data of ellipses) {
        const ellipse = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "ellipse"
        );
        ellipse.setAttributeNS(null, "opacity", "0.04");
        ellipse.setAttributeNS(null, "cx", "10.5");
        ellipse.setAttributeNS(null, "cy", "5.80029008");
        ellipse.setAttributeNS(null, "rx", data["rx"]);
        ellipse.setAttributeNS(null, "ry", data["ry"]);
        shadow.appendChild(ellipse);
      }

      const background = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      background.setAttributeNS(null, "fill", color);

      const bgPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      bgPath.setAttributeNS(
        null,
        "d",
        "M27,13.5 C27,19.074644 20.250001,27.000002 14.75,34.500002 C14.016665,35.500004 12.983335,35.500004 12.25,34.500002 C6.7499993,27.000002 0,19.222562 0,13.5 C0,6.0441559 6.0441559,0 13.5,0 C20.955844,0 27,6.0441559 27,13.5 Z"
      );

      background.appendChild(bgPath);

      const border = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      border.setAttributeNS(null, "opacity", "0.25");
      border.setAttributeNS(null, "fill", "#000000");

      const borderPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      borderPath.setAttributeNS(
        null,
        "d",
        "M13.5,0 C6.0441559,0 0,6.0441559 0,13.5 C0,19.222562 6.7499993,27 12.25,34.5 C13,35.522727 14.016664,35.500004 14.75,34.5 C20.250001,27 27,19.074644 27,13.5 C27,6.0441559 20.955844,0 13.5,0 Z M13.5,1 C20.415404,1 26,6.584596 26,13.5 C26,15.898657 24.495584,19.181431 22.220703,22.738281 C19.945823,26.295132 16.705119,30.142167 13.943359,33.908203 C13.743445,34.180814 13.612715,34.322738 13.5,34.441406 C13.387285,34.322738 13.256555,34.180814 13.056641,33.908203 C10.284481,30.127985 7.4148684,26.314159 5.015625,22.773438 C2.6163816,19.232715 1,15.953538 1,13.5 C1,6.584596 6.584596,1 13.5,1 Z"
      );

      border.appendChild(borderPath);

      const maki = document.createElementNS("http://www.w3.org/2000/svg", "g");
      maki.setAttributeNS(null, "transform", "translate(6.0, 7.0)");
      maki.setAttributeNS(null, "fill", "#FFFFFF");

      const circleContainer = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      circleContainer.setAttributeNS(null, "transform", "translate(8.0, 8.0)");

      const circle1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle1.setAttributeNS(null, "fill", "#000000");
      circle1.setAttributeNS(null, "opacity", "0.25");
      circle1.setAttributeNS(null, "cx", "5.5");
      circle1.setAttributeNS(null, "cy", "5.5");
      circle1.setAttributeNS(null, "r", "5.4999962");

      const circle2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle2.setAttributeNS(null, "fill", "#FFFFFF");
      circle2.setAttributeNS(null, "cx", "5.5");
      circle2.setAttributeNS(null, "cy", "5.5");
      circle2.setAttributeNS(null, "r", "5.4999962");

      circleContainer.appendChild(circle1);
      circleContainer.appendChild(circle2);

      page1.appendChild(shadow);
      page1.appendChild(background);
      page1.appendChild(border);
      page1.appendChild(maki);
      page1.appendChild(circleContainer);

      svg.appendChild(page1);

      svg.setAttributeNS(null, "height", `${defaultMarkerHeight / 2}px`);
      svg.setAttributeNS(null, "width", `${defaultMarkerWidth / 2}px`);
    }
  }, []);
  return <SvgIcon ref={drawMarker} {...rest} />;
};

export default MapMarker;
