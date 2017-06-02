import Variable from "../../shared/models/Variable";
import Conditional from "../../shared/models/Conditional";

export interface Addon {

    metadata: Metadata;

    variables?: Variable[];

    conditionals?: Conditional[];

}

export interface Metadata {
    id: string;
    name: string;
    creationDate: Date;
}

export default Addon;
