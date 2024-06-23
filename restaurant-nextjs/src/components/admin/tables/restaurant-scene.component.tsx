import { TableDto } from "@/common/dto/tables/table.dto";
import { FormTableDto } from "@/components/admin/tables/table-list.component";
import styles from "@/styles/admin.module.sass";
import { CameraControls, Sky, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { BufferGeometry, Material, MeshStandardMaterial } from "three";

useGLTF.preload("/RestaurantScene.glb");

export interface RestaurantSceneComponentProps {
    tables: TableDto[];
    table: FormTableDto;
    isPositionValid: boolean;
}

export function RestaurantSceneComponent({
    tables,
    table,
    isPositionValid,
}: RestaurantSceneComponentProps) {
    const { nodes } = useGLTF("/RestaurantScene.glb") as unknown as {
        nodes: BufferGeometry[];
    };
    return (
        <div className={styles["restaurant-scene"]}>
            <Canvas
                orthographic={true}
                camera={{ position: [0, 5, -6], zoom: 35 }}
            >
                <CameraControls makeDefault={true} />
                <ambientLight intensity={10} />
                <Sky sunPosition={[10, 20, 10]} />
                <Suspense fallback={null}>
                    <group dispose={null}>
                        <group>
                            {tables.map((t) => (
                                <Table
                                    key={t.id}
                                    geometry={nodes["Table"].geometry}
                                    material={nodes["Table"].material}
                                    table={t}
                                />
                            ))}
                            <Table
                                geometry={nodes["Table"].geometry}
                                material={nodes["Table"].material}
                                table={table}
                                isPositionValid={isPositionValid}
                            />
                        </group>
                        <group>
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["Ground"].geometry}
                                material={nodes["Ground"].material}
                                scale={[8, 0.1, 7]}
                            />
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["Wall_(1)"].geometry}
                                material={nodes["Wall_(1)"].material}
                                position={[3.95, 1.05, -0.5]}
                                scale={[0.1, 2, 6]}
                            />
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["Wall_(2)"].geometry}
                                material={nodes["Wall_(2)"].material}
                                position={[0.75, 1.05, 2.55]}
                                scale={[0.5, 2, 0.1]}
                            />
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["Wall_(3)"].geometry}
                                material={nodes["Wall_(3)"].material}
                                position={[2, 0.25, 2.55]}
                                scale={[2, 0.4, 0.1]}
                            />
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["Wall_(4)"].geometry}
                                material={nodes["Wall_(4)"].material}
                                position={[2, 1.9, 2.55]}
                                scale={[2, 0.3, 0.1]}
                            />
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["Wall_(5)"].geometry}
                                material={nodes["Wall_(5)"].material}
                                position={[3.5, 1.05, 2.55]}
                                scale={[1, 2, 0.1]}
                            />
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["Wall_(6)"].geometry}
                                material={nodes["Wall_(6)"].material}
                                position={[-3.95, 1.05, -0.5]}
                                scale={[0.1, 2, 6]}
                            />
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["Wall_(7)"].geometry}
                                material={nodes["Wall_(7)"].material}
                                position={[-0.75, 1.05, 2.55]}
                                scale={[0.5, 2, 0.1]}
                            />
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["Wall_(8)"].geometry}
                                material={nodes["Wall_(8)"].material}
                                position={[-2, 1.9, 2.55]}
                                scale={[2, 0.3, 0.1]}
                            />
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["Wall_(9)"].geometry}
                                material={nodes["Wall_(9)"].material}
                                position={[-2, 0.25, 2.55]}
                                scale={[2, 0.4, 0.1]}
                            />
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["Wall_(10)"].geometry}
                                material={nodes["Wall_(10)"].material}
                                position={[-3.5, 1.05, 2.55]}
                                scale={[1, 2, 0.1]}
                            />
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["Wall_(11)"].geometry}
                                material={nodes["Wall_(11)"].material}
                                position={[0, 1.85, 2.55]}
                                scale={[1, 0.4, 0.1]}
                            />
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["Window_(1)"].geometry}
                                material={nodes["Window_(1)"].material}
                                position={[1, 0.45, 2.55]}
                                scale={[0.032, 0.022, 0.02]}
                            >
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["ID60"].geometry}
                                    material={nodes["ID60"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["Component_23"].geometry}
                                    material={nodes["Component_23"].material}
                                    position={[20.5, 48.5, -1.5]}
                                    rotation={[0, 0, Math.PI]}
                                >
                                    <mesh
                                        castShadow={true}
                                        receiveShadow={true}
                                        geometry={nodes["ID15"].geometry}
                                        material={nodes["ID15"].material}
                                    />
                                </mesh>
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["Component_23_1"].geometry}
                                    material={nodes["Component_23_1"].material}
                                    position={[2.5, 9.5, -2.5]}
                                >
                                    <mesh
                                        castShadow={true}
                                        receiveShadow={true}
                                        geometry={nodes["ID15_1"].geometry}
                                        material={nodes["ID15_1"].material}
                                    />
                                </mesh>
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["Component_23_2"].geometry}
                                    material={nodes["Component_23_2"].material}
                                    position={[41.5, 9.5, -2.5]}
                                >
                                    <mesh
                                        castShadow={true}
                                        receiveShadow={true}
                                        geometry={nodes["ID15_2"].geometry}
                                        material={nodes["ID15_2"].material}
                                    />
                                </mesh>
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["Component_23_3"].geometry}
                                    material={nodes["Component_23_3"].material}
                                    position={[59.5, 48.5, -1.5]}
                                    rotation={[0, 0, Math.PI]}
                                >
                                    <mesh
                                        castShadow={true}
                                        receiveShadow={true}
                                        geometry={nodes["ID15_3"].geometry}
                                        material={nodes["ID15_3"].material}
                                    />
                                </mesh>
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["Component_23_4"].geometry}
                                    material={nodes["Component_23_4"].material}
                                    position={[22, 9.5, -2.5]}
                                >
                                    <mesh
                                        castShadow={true}
                                        receiveShadow={true}
                                        geometry={nodes["ID15_4"].geometry}
                                        material={nodes["ID15_4"].material}
                                    />
                                </mesh>
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["Component_23_5"].geometry}
                                    material={nodes["Component_23_5"].material}
                                    position={[40, 48.5, -1.5]}
                                    rotation={[0, 0, Math.PI]}
                                >
                                    <mesh
                                        castShadow={true}
                                        receiveShadow={true}
                                        geometry={nodes["ID15_5"].geometry}
                                        material={nodes["ID15_5"].material}
                                    />
                                </mesh>
                            </mesh>
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["Window_(2)"].geometry}
                                material={nodes["Window_(2)"].material}
                                position={[-1, 0.45, 2.55]}
                                scale={[-0.032, 0.022, 0.02]}
                            >
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["ID60_1"].geometry}
                                    material={nodes["ID60_1"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["Component_23_1"].geometry}
                                    material={nodes["Component_23_1"].material}
                                    position={[20.5, 48.5, -1.5]}
                                    rotation={[0, 0, Math.PI]}
                                >
                                    <mesh
                                        castShadow={true}
                                        receiveShadow={true}
                                        geometry={nodes["ID15_1"].geometry}
                                        material={nodes["ID15_1"].material}
                                    />
                                </mesh>
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={
                                        nodes["Component_23_1_1"].geometry
                                    }
                                    material={
                                        nodes["Component_23_1_1"].material
                                    }
                                    position={[2.5, 9.5, -2.5]}
                                >
                                    <mesh
                                        castShadow={true}
                                        receiveShadow={true}
                                        geometry={nodes["ID15_1_1"].geometry}
                                        material={nodes["ID15_1_1"].material}
                                    />
                                </mesh>
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={
                                        nodes["Component_23_2_1"].geometry
                                    }
                                    material={
                                        nodes["Component_23_2_1"].material
                                    }
                                    position={[41.5, 9.5, -2.5]}
                                >
                                    <mesh
                                        castShadow={true}
                                        receiveShadow={true}
                                        geometry={nodes["ID15_2_1"].geometry}
                                        material={nodes["ID15_2_1"].material}
                                    />
                                </mesh>
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={
                                        nodes["Component_23_3_1"].geometry
                                    }
                                    material={
                                        nodes["Component_23_3_1"].material
                                    }
                                    position={[59.5, 48.5, -1.5]}
                                    rotation={[0, 0, Math.PI]}
                                >
                                    <mesh
                                        castShadow={true}
                                        receiveShadow={true}
                                        geometry={nodes["ID15_3_1"].geometry}
                                        material={nodes["ID15_3_1"].material}
                                    />
                                </mesh>
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={
                                        nodes["Component_23_4_1"].geometry
                                    }
                                    material={
                                        nodes["Component_23_4_1"].material
                                    }
                                    position={[22, 9.5, -2.5]}
                                >
                                    <mesh
                                        castShadow={true}
                                        receiveShadow={true}
                                        geometry={nodes["ID15_4_1"].geometry}
                                        material={nodes["ID15_4_1"].material}
                                    />
                                </mesh>
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={
                                        nodes["Component_23_5_1"].geometry
                                    }
                                    material={
                                        nodes["Component_23_5_1"].material
                                    }
                                    position={[40, 48.5, -1.5]}
                                    rotation={[0, 0, Math.PI]}
                                >
                                    <mesh
                                        castShadow={true}
                                        receiveShadow={true}
                                        geometry={nodes["ID15_5_1"].geometry}
                                        material={nodes["ID15_5_1"].material}
                                    />
                                </mesh>
                            </mesh>
                            <group position={[0.73, 0.19, 2.14]}>
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["TreePot_1"].geometry}
                                    material={nodes["TreePot_1"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["TreePot_2"].geometry}
                                    material={nodes["TreePot_2"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["TreePot_3"].geometry}
                                    material={nodes["TreePot_3"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["TreePot_4"].geometry}
                                    material={nodes["TreePot_4"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["TreePot_5"].geometry}
                                    material={nodes["TreePot_5"].material}
                                />
                            </group>
                            <group position={[-0.82, 0.23, 2.06]} scale={1.34}>
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["PlantPot_1"].geometry}
                                    material={nodes["PlantPot_1"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["PlantPot_2"].geometry}
                                    material={nodes["PlantPot_2"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["PlantPot_3"].geometry}
                                    material={nodes["PlantPot_3"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["PlantPot_4"].geometry}
                                    material={nodes["PlantPot_4"].material}
                                />
                            </group>
                            <group
                                position={[3.61, 0.17, 1.01]}
                                rotation={[Math.PI, -1.466, Math.PI]}
                                scale={0.65}
                            >
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["BambooPot_(1)_1"].geometry}
                                    material={nodes["BambooPot_(1)_1"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["BambooPot_(1)_2"].geometry}
                                    material={nodes["BambooPot_(1)_2"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["BambooPot_(1)_3"].geometry}
                                    material={nodes["BambooPot_(1)_3"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["BambooPot_(1)_4"].geometry}
                                    material={nodes["BambooPot_(1)_4"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["BambooPot_(1)_5"].geometry}
                                    material={nodes["BambooPot_(1)_5"].material}
                                />
                            </group>
                            <group
                                position={[-3.61, 0.17, 1.01]}
                                rotation={[0, -1.466, 0]}
                                scale={0.65}
                            >
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["BambooPot_(1)_1"].geometry}
                                    material={nodes["BambooPot_(1)_1"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["BambooPot_(1)_2"].geometry}
                                    material={nodes["BambooPot_(1)_2"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["BambooPot_(1)_3"].geometry}
                                    material={nodes["BambooPot_(1)_3"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["BambooPot_(1)_4"].geometry}
                                    material={nodes["BambooPot_(1)_4"].material}
                                />
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["BambooPot_(1)_5"].geometry}
                                    material={nodes["BambooPot_(1)_5"].material}
                                />
                            </group>
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["DracaenaPot"].geometry}
                                material={nodes["DracaenaPot"].material}
                                position={[-2.923, 0.05, 1.895]}
                            >
                                <mesh
                                    castShadow={true}
                                    receiveShadow={true}
                                    geometry={nodes["Small"].geometry}
                                    material={nodes["Small"].material}
                                    position={[0, 0.09, 0]}
                                    scale={4.09}
                                />
                            </mesh>
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["IvyPot"].geometry}
                                material={nodes["IvyPot"].material}
                                position={[3.025, 0.05, 2.034]}
                                scale={0.5}
                            >
                                <group position={[0, 0.33, 0]}>
                                    <mesh
                                        castShadow={true}
                                        receiveShadow={true}
                                        geometry={
                                            nodes["BigEvergreen_1"].geometry
                                        }
                                        material={
                                            nodes["BigEvergreen_1"].material
                                        }
                                    />
                                    <mesh
                                        castShadow={true}
                                        receiveShadow={true}
                                        geometry={
                                            nodes["BigEvergreen_2"].geometry
                                        }
                                        material={
                                            nodes["BigEvergreen_2"].material
                                        }
                                    />
                                </group>
                            </mesh>
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["Lamp_(1)"].geometry}
                                material={nodes["Lamp_(1)"].material}
                                position={[3.63, 0.03, 2.033]}
                                scale={0.7}
                            />
                            <mesh
                                castShadow={true}
                                receiveShadow={true}
                                geometry={nodes["Lamp_(2)"].geometry}
                                material={nodes["Lamp_(2)"].material}
                                position={[-3.63, 0.03, 2.033]}
                                scale={0.7}
                            />
                        </group>
                    </group>
                </Suspense>
            </Canvas>
        </div>
    );
}

interface TableProps {
    geometry: BufferGeometry;
    material: Material;
    table: FormTableDto;
    isPositionValid?: boolean;
}

function Table({ geometry, material, table, isPositionValid }: TableProps) {
    return (
        <mesh
            castShadow={true}
            receiveShadow={true}
            position={[table.positionX, 0.64, table.positionY]}
            rotation={[0, table.rotation * (Math.PI / 180), 0]}
            scale={[table.scaleX, 1, table.scaleY]}
            geometry={geometry}
            material={
                isPositionValid === undefined
                    ? material
                    : new MeshStandardMaterial({
                          color: isPositionValid ? "darkred" : "green",
                      })
            }
        />
    );
}
