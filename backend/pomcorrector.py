import xml.etree.ElementTree as ET
import os

def get_versions_from_parent_pom(parent_pom_path):
    tree = ET.parse(parent_pom_path)
    root = tree.getroot()
    namespaces = {'maven': 'http://maven.apache.org/POM/4.0.0'}
    versions = {}
    
    for dependency in root.findall(".//maven:dependencyManagement/maven:dependencies/maven:dependency", namespaces):
        group_id = dependency.find('maven:groupId', namespaces).text
        artifact_id = dependency.find('maven:artifactId', namespaces).text
        version = dependency.find('maven:version', namespaces).text
        versions[(group_id, artifact_id)] = version

    return versions

def update_microservice_pom(microservice_pom_path, versions):
    tree = ET.parse(microservice_pom_path)
    root = tree.getroot()
    namespaces = {'maven': 'http://maven.apache.org/POM/4.0.0'}
    updated = False

    for dependency in root.findall(".//maven:dependencies/maven:dependency", namespaces):
        group_id = dependency.find('maven:groupId', namespaces).text
        artifact_id = dependency.find('maven:artifactId', namespaces).text
        version = dependency.find('maven:version', namespaces)

        if (group_id, artifact_id) in versions and version is None:
            new_version = ET.SubElement(dependency, 'version')
            new_version.text = versions[(group_id, artifact_id)]
            updated = True

    if updated:
        tree.write(microservice_pom_path)

def main():
    parent_pom_path = './backend/pom.xml'  # Update this path to your parent POM
    microservices_dir = './microservices'  # Update this path to your microservices directory

    versions = get_versions_from_parent_pom(parent_pom_path)

    for root, dirs, files in os.walk(microservices_dir):
        for file in files:
            if file.endswith('pom.xml'):
                microservice_pom_path = os.path.join(root, file)
                update_microservice_pom(microservice_pom_path, versions)

if __name__ == "__main__":
    main()
