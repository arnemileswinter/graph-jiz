
start -> _ connection _ end start
        {%
            data => {
                if(data[4]) {
                  return [data[1],...data[4]];
                }
                return [data[1]];
            }
        %}
        | _ lineComment start {% data => data[2] %}
        | _ {% () => null %}

end -> ";" {% () => null %}

lineComment -> "#" ([^\n]):* "\n" {% data => ({ type: "lineComment", content: data[1].join("")}) %}
            |  "//" ([^\n]):* "\n"{% data => ({ type: "lineComment", content: data[1].join("")}) %}

connection -> connection _ connector _ labelledNode
            {%
                data => ({
                    type: "connection",
                    connector: data[2],
                    from: data[0],
                    to: data[4]
                })
            %}
            | labelledNode {% id %}

labelledNode -> node _ label
                {%
                 data => ({
                    type: "node",
                    name: data[0],
                    label: data[2]
                 })
                %}
             | node
             {%
                data => ({ type: "node", name: data[0], label: null})
             %}


label -> "[" labelContent "]" {% data => data[1] %}
        | "[" "]" {% data => '' %}

labelContent -> labelCharacter {% id %}
             | labelContent labelCharacter {% data => data[0] + data[1] %}
labelCharacter -> [^\\\]] {% id %}
               | "\\" labelCharacterEscape {% data => "\\" + data[1] %}
labelCharacterEscape -> . {% id %}


connector -> line                   {% data => ({type:"line", length:data[0].length, label: null})%}
          | line label line         {% data => ({type:"line", length: data[0].length + data[2].length, label:data[1]}) %}
          | "<" line                {% data => ({type:"left_arrow", length:data[1].length, label: null}) %}
          | "<" label line          {% data => ({type:"left_arrow", length:data[2].length, label: data[1]}) %}
          | "<" line label line     {% data => ({type:"left_arrow", length:data[1].length + data[3].length, label: data[2]}) %}
          | "<" line ">"            {% data => ({type:"bi_arrow", length:data[1].length, label: null}) %}
          | "<" label ">"           {% data => ({type:"bi_arrow", length:0, label: data[1]}) %}
          | "<" line label line ">" {% data => ({type:"bi_arrow", length:data[1].length + data[3].length, label: data[2]}) %}
          | line ">"                {% data => ({type:"right_arrow", length:data[0].length, label: null}) %}
          | line label ">"          {% data => ({type:"right_arrow", length:data[0].length, label: data[1]}) %}
          | line label line ">"     {% data => ({type:"right_arrow", length:data[0].length + data[2].length, label: data[1]}) %}

line -> [-=]:+ {% id %}

node -> ([^\s\-<>=;\[\]\/#]):+ {%data => data.map(d => d.join("")).join("")%}

# Whitespace. The important thing here is that the postprocessor
# is a null-returning function. This is a memory efficiency trick.
_ -> [\s]:* {% () => null %}
__ -> [\s]:+ {% () => null %}
