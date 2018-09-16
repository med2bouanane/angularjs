module arvato.demat.directive {


    export interface ITreeModelAttributes extends ng.IAttributes {
        treeId: any;
        treeModel: any;
        nodeLabel: string;
        nodeChildren: any;
        angularTreeview: any;
        nodeId: any;
    }

    app.directive("treeModel", function ($compile) {
        return {
            restrict: "A",
            link: function (scope, element, attrs: ITreeModelAttributes) {
                var a = attrs.treeId,
                    g = attrs.treeModel,
                    e = attrs.nodeLabel || "label",
                    d = attrs.nodeChildren || "children",
                    e = '<ul><li data-ng-repeat="node in ' + g + '"><i class="fa fa-envelope" data-ng-show="node.structuralEntityType.id===\'##STRUCTURAL_ENTITY_TYPE_CODE_ENVELOPE##\' && node.collapsed" data-ng-click="' + a + '.selectNodeHead(node)"></i><i class="fa fa-envelope-o" data-ng-show="node.structuralEntityType.code===\'##STRUCTURAL_ENTITY_TYPE_CODE_ENVELOPE##\' && !node.collapsed" data-ng-click="' + a + '.selectNodeHead(node)"></i><i class="fa fa-file-archive-o" data-ng-show="node.structuralEntityType.code===\'##STRUCTURAL_ENTITY_TYPE_CODE_DOCUMENT##\' && node.collapsed" data-ng-click="' + a + '.selectNodeHead(node)"></i><i class="fa fa-file-o" data-ng-show="node.structuralEntityType.code===\'##STRUCTURAL_ENTITY_TYPE_CODE_DOCUMENT##\' && !node.collapsed" data-ng-click="' + a + '.selectNodeHead(node)"></i><i class="fa fa-file-image-o" data-ng-hide="node.' +
                        d + '.length"></i> <span data-ng-class="node.selected" data-ng-click="' + a + '.selectNodeLabel(node)">{{(node.documentType && node.documentType.label) ? node.documentType.label : node.' + e + '}}  <i ng-show="node.structuralEntityType.code===\'##STRUCTURAL_ENTITY_TYPE_CODE_DOCUMENT##\' && node.documentType.label" class="fa fa-check-circle-o" style="color:green" aria-hidden="true"></i><i ng-hide="node.structuralEntityType.code!==\'##STRUCTURAL_ENTITY_TYPE_CODE_DOCUMENT##\' || node.documentType.label" class="fa fa-question-circle-o" style="color:red" aria-hidden="true"></i></span><div data-ng-hide="node.collapsed" data-tree-id="' + a + '" data-tree-model="node.' + d + '" data-node-id=' + (attrs.nodeId || "id") + " data-node-label=" + e + " data-node-children=" + d + "></div></li></ul>";
                a && g && (attrs.angularTreeview && (scope[a] = scope[a] || {}, scope[a].selectNodeHead = scope[a].selectNodeHead || function (a) {
                    a.collapsed = !a.collapsed
                }, scope[a].selectNodeLabel = scope[a].selectNodeLabel || function (c) {
                    scope[a].currentNode && scope[a].currentNode.selected &&
                    (scope[a].currentNode.selected = void 0);
                    c.selected = "selected";
                    scope[a].currentNode = c
                }), element.html('').append($compile(e)(scope)))
            }
        }
    });

}

/*
module arvato.demat.directive {

    app.directive("treeModel", function ($compile) {
        return {
            restrict: "A",
            link: function (b, h, c) {
                var a = c.treeId,
                    g = c.treeModel,
                    e = c.nodeLabel || "label",
                    d = c.nodeChildren || "children",
                    e = '<ul><li data-ng-repeat="node in ' + g + '"><i class="collapsed" data-ng-show="node.' + d + '.length && node.collapsed" data-ng-click="' + a + '.selectNodeHead(node)"></i><i class="expanded" data-ng-show="node.' + d + '.length && !node.collapsed" data-ng-click="' + a + '.selectNodeHead(node)"></i><i class="normal" data-ng-hide="node.' +
                        d + '.length"></i> <span data-ng-class="node.selected" data-ng-click="' + a + '.selectNodeLabel(node)">{{node.' + e + '}}</span><div data-ng-hide="node.collapsed" data-tree-id="' + a + '" data-tree-model="node.' + d + '" data-node-id=' + (c.nodeId || "id") + " data-node-label=" + e + " data-node-children=" + d + "></div></li></ul>";
                a && g && (c.angularTreeview && (b[a] = b[a] || {}, b[a].selectNodeHead = b[a].selectNodeHead || function (a) {
                    a.collapsed = !a.collapsed
                }, b[a].selectNodeLabel = b[a].selectNodeLabel || function (c) {
                    b[a].currentNode && b[a].currentNode.selected &&
                        (b[a].currentNode.selected = void 0);
                    c.selected = "selected";
                    b[a].currentNode = c
                }), h.html('').append($compile(e)(b)))
            }
        }
    });
}
*/


