import { WixClient } from "@/lib/wix-client.base";
import { members } from "@wix/members";
import { cache } from "react";

export const getLoggedInMember = cache(
  async (wixClient: WixClient): Promise<members.Member | null> => {
    if (!wixClient.auth.loggedIn()) {
      return null;
    }

    const memberData = await wixClient.members.getCurrentMember({
      fieldsets: [members.Set.FULL],
    });

    return memberData.member ?? null;
  },
);

export interface UpdateMemberInfoValues {
  nome: string;
  sobrenome: string;
}

export async function updateMemberInfo(
  wixClient: WixClient,
  { nome, sobrenome }: UpdateMemberInfoValues,
) {
  const loggedInMember = await getLoggedInMember(wixClient);

  if (!loggedInMember?._id) {
    throw Error("ID do membro não encontrado");
  }

  return wixClient.members.updateMember(loggedInMember._id, {
    contact: {
      firstName: nome,
      lastName: sobrenome,
    },
  });
}
