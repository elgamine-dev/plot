import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

export default async function() {
  const brands = await d3.csv("data/category-brands.csv", d3.autoType);
  return Plot.plot({
    width: 980,
    height: 15 * 40,
    marginTop: 20,
    marginLeft: 10,
    marginBottom: 10,
    x: { axis: null, domain: [0, 1] },
    y: { domain: d3.range(0, 15), axis: null },
    color: {
      scheme: "tableau10",
      domain: d3.groupSort(
        brands,
        (v) => d3.mean(v, (d) => d.value),
        (d) => d.category
      )
    },
    time: {
      delay: 1000,
      duration: 20000
    },
    marks: [
      Plot.barX(
        brands,
        Plot.normalizeX(
          Plot.mapY("rank", {
            fillOpacity: 0.6,
            mixBlendMode: "multiply",
            x: "value",
            y: (d) => -d.value,
            fill: "category",
            time: "date",
            key: "name",
            z: null
          })
        )
      ),
  
      // ticks
      ((data, options) => {
        options = Plot.mapY("rank", { ...options, title: options.x });
        const b = Plot.tickX(data, options);
        b.render = (
          index,
          { x },
          { title: T },
          { height, marginTop, marginBottom }
        ) =>
          d3
            .create("svg:g")
            .attr("transform", "translate(0, 20)")
            .call(
              d3
                .axisTop(
                  d3.scaleLinear([0, d3.max(index, (i) => T[i])], x.range())
                )
                .ticks(8)
                .tickSize(-height + marginTop + marginBottom)
            )
            .call((g) => {
              g.select(".domain").remove();
              g.attr("stroke-width", 0.75).attr("font-size", 8);
              g.selectAll("line").attr("stroke", "white");
            })
            .node();
        return b;
      })(brands, {
        x: "value",
        time: "date",
        key: "name",
        y: (d) => -d.value,
        z: null
      }),
      Plot.tickX([0]),
  
      Plot.text(
        brands,
        Plot.selectMaxX({
          text: (d) => `${d.date.getUTCFullYear()}`,
          frameAnchor: "bottom-right",
          time: "date",
          x: (d) => d.value * 1e-9 + 1,
          dy: -15,
          fontSize: 40,
          fontWeight: "bold",
          fontVariant: "tabular-nums",
          fill: "currentColor",
          stroke: "white",
          strokeWidth: 30
        })
      ),
  
      Plot.textX(
        brands,
        Plot.normalizeX(
          Plot.mapY("rank", {
            x: "value",
            y: (d) => -d.value,
            text: "name",
            textAnchor: "end",
            fontSize: 12,
            dx: -4,
            dy: -7,
            time: "date",
            key: "name",
            fill: "currentColor",
            fontWeight: "bold",
            z: null
          })
        )
      ),
  
      Plot.textX(
        brands,
        Plot.normalizeX(
          Plot.mapY("rank", {
            x: "value",
            sort: (d) => -d.value,
            y: (d) => -d.value,
            text: "value",
            textAnchor: "end",
            dx: -4,
            dy: 8,
            time: "date",
            key: "name",
            fill: "currentColor",
            z: null
          })
        )
      )
    ]
  });
}

