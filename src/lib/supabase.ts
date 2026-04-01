import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gclzimnozcxsttgghooh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_gSOFbPXM_si8h2ZIfEA8rg_l1v1bzwh";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
