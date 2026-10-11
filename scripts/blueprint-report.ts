/** Prints the blueprint verification table used in docs/BLUEPRINTS.md. `npx tsx scripts/blueprint-report.ts` */
import { BLUEPRINTS, unverifiedFacts } from "../src/domain/blueprints";

for (const bp of BLUEPRINTS) {
  const open = unverifiedFacts(bp);
  console.log(`\n### ${bp.officialName} (\`${bp.key}\`, ${bp.version})\n`);
  console.log(open.length ? `${open.length} fact(s) need administrator confirmation:\n` : "All facts verified against official sources.\n");
  for (const f of open) console.log(`- **${f.path}**: ${JSON.stringify(f.value)}. ${f.note ?? ""}`);
}
