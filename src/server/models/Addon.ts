import Variable from "../../shared/models/Variable";

export interface Addon {

    metadata: Metadata;

    variables?: Variable[];

}

export interface Metadata {
    id: string;
    name: string;
    creationDate: Date;
}

export default Addon;
